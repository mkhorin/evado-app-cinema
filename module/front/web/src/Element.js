/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
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