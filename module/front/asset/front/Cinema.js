/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
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