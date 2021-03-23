/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
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