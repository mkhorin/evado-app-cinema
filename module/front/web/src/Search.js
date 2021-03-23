/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
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