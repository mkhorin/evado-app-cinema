'use strict';

class Cinema {

    static getElementClass (name) {
        return Cinema[name]?.prototype instanceof Cinema.Element ? Cinema[name] : null;
    }

    static toggle ($element, state) {
        return $element.toggleClass('hidden', !state);
    }

    static getTemplate (name, container) {
        return container.querySelector(`template[data-id="${name}"]`)?.innerHTML;
    }

    static resolveTemplate (text, data) {
        return text.replace(/{{(\w+)}}/gm, (match, key)=> data.hasOwnProperty(key) ? data[key] : '');
    }

    static setPageTitle (text) {
        const $title = $(document.head).find('title');
        const base = $title.data('title');
        $title.html(text ? `${Jam.t(text)} - ${base}` : base);
    }

    static escapeData (data, keys) {
        for (const key of keys || Object.keys(data)) {
            data[key] = this.escapeHtml(data[key]);
        }
    }

    static escapeHtml (value) {
        return typeof value === 'string' ? value.replace(/</g, '&lt;').replace(/>/g, '&gt;') : value;
    }

    constructor () {
        this.ajaxQueue = new Cinema.AjaxQueue;
        this.$container = $('.cinema');
        this.createHandlers();
        this.initHandlers();
        this.on('click', '[data-action="schedule"]', this.onSchedule.bind(this));
        this.on('click', '[data-action="screening"]', this.onScreening.bind(this));
        this.on('click', '[data-action="hall"]', this.onHall.bind(this));
    }

    showPage (name) {
        this.trigger('page:show', {name})
    }

    getPage (name) {
        return this.getPages().filter(`[data-page="${name}"]`);
    }

    getPages () {
        return this.$container.children('.page');
    }

    togglePage (name) {
        this.getPages().removeClass('active');
        this.getPage(name).addClass('active');
    }

    getHandler (name) {
        return this.$container.find(`[data-handler="${name}"]`).data('handler');
    }

    createHandlers () {
        this._handlers = [];
        for (const element of document.querySelectorAll('[data-handler]')) {
            const name = element.dataset.handler;
            const Class = this.constructor.getElementClass(name);
            if (Class) {
                this._handlers.push(new Class(element, this));
            } else {
                console.error(`Handler not found: ${name}`);
            }
        }
    }

    initHandlers () {
        for (const handler of this._handlers) {
            if (handler.init) {
                handler.init();
            }
        }
    }

    toggleLoader (state) {
        $('.global-loader').toggle(state);
    }

    on () {
        this.$container.on(...arguments);
    }

    trigger () {
        this.$container.trigger(...arguments);
    }

    onSchedule (event) {
        event.preventDefault();
        this.showPage('schedule');
    }

    onScreening (event) {
        event.preventDefault();
        const screening = $(event.currentTarget).closest('[data-screening]').data('screening');
        this.trigger('action:screening', {screening});
    }

    onHall (event) {
        event.preventDefault();
        const $hall = $(event.currentTarget).closest('[data-hall]');
        const hall = $hall.data('hall');
        this.trigger('action:hall', {hall, $hall});
    }
}

Cinema.Element = class Element {

    constructor (container, cinema) {
        this.cinema = cinema;
        this.container = container;
        this.$container = $(container);
        this.$container.data('handler', this);
        this.dataMap = this.$container.data();
    }

    find () {
        return this.$container.find(...arguments);
    }

    getHandler (name) {
        return this.find(`[data-handler="${name}"]`).data('handler');
    }

    getTemplate (name) {
        return Cinema.getTemplate(name, this.container);
    }

    resolveTemplate (name, data) {
        return Cinema.resolveTemplate(this.getTemplate(name), data);
    }

    renderError (data) {
        return `${data.statusText}: ${data.responseText}`;
    }

    on () {
        this.$container.on(...arguments);
    }

    trigger () {
        this.$container.trigger(...arguments);
    }
};

Cinema.AjaxQueue = class AjaxQueue {

    constructor () {
        this._tasks = [];
    }

    post (...args) {
        const deferred = $.Deferred();
        this._tasks.push({deferred, args});
        this.execute();
        return deferred;
    }

    remove (deferred) {
        const index = this.getTaskIndex(deferred);
        if (index !== undefined) {
            this._tasks.splice(index, 1);
        }
    }

    getTaskIndex (deferred) {
        for (let i = 0; i < this._tasks.length; ++i) {
            if (this._tasks[i].deferred === deferred) {
                return i;
            }
        }
    }

    execute () {
        if (this._xhr || !this._tasks.length) {
            return false;
        }
        const {deferred, args} = this._tasks.splice(0, 1)[0];
        const csrf = Jam.getCsrfToken();
        const data = {csrf, ...args[1]};
        const params = {
            method: 'post',
            contentType: 'application/json',
            url: args[0],
            data: JSON.stringify(data)
        };
        this._xhr = $.ajax(params)
            .always(() => this._xhr = null)
            .done(data => deferred.resolve(data))
            .fail(data => deferred.reject(data));
        deferred.done(this.next.bind(this));
        deferred.fail(this.next.bind(this));
    }

    next () {
        this.execute();
    }

    abort () {
        this._xhr?.abort();
        this._xhr = null;
    }
};

Cinema.Loadable = class Loadable extends Cinema.Element {

    init () {
        this.$content = this.$container.children('.loadable-content');
    }

    isLoading () {
        return this.$container.hasClass('loading');
    }

    load () {
        if (this.isLoading()) {
            return false;
        }
        this.toggleLoading(true);
        this._deferred = this.cinema.ajaxQueue
            .post(this.dataMap.url, this.getPostData())
            .done(this.onDone.bind(this))
            .fail(this.onFail.bind(this));
        return this._deferred;
    }

    getPostData () {
        return null;
    }

    toggleLoading (state) {
        this.$container.toggleClass('loading', state);
    }

    onDone (data) {
        this.toggleLoading(false);
        this.$content.html(this.render(data));
        Jam.t(this.$container);
        Jam.Helper.executeSerialImageLoading(this.$container);
    }

    onFail (data) {
        this.toggleLoading(false);
        this.$content.html(this.renderError(data));
    }

    render (data) {
        return data;
    }

    renderError (data) {
        return `${data.statusText}: ${data.responseText}`;
    }
};

Cinema.Search = class Search extends Cinema.Element {

    init () {
        this.$search = this.find('[type="search"]');
        this.on('submit', this.onSubmit.bind(this));
        this.on('search:clear', this.onClear.bind(this));
    }

    onClear () {
        this.$search.val('');
        this.triggerChange();
    }

    onSubmit (event) {
        event.preventDefault();
        this.triggerChange();
    }

    triggerChange () {
        this.$container.trigger('search:change', {search: this.$search.val()});
    }
};