/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Cinema.ScreeningList = class ScreeningList extends Cinema.Loadable {

    init () {
        super.init();
        this.pagination = new Cinema.Pagination(this);
        this.on('change:pagination', this.onChangePagination.bind(this));
    }

    getPostData () {
        return {
            class: 'screening',
            view: 'publicList',
            start: this.pagination.getOffset(),
            length: this.pagination.getPageSize(),
            filter: this.getFilter()
        };
    }

    getFilter () {
        if (!this.search) {
            return null;
        }
        return [{
            attr: 'movie',
            op: 'nested',
            value: [{
                attr: 'title',
                op: 'contains',
                value: this.search
            }]
        }];
    }

    bindSearch (handler) {
        handler.on('search:change', this.onSearch.bind(this));
    }

    onSearch (event, {search}) {
        this.search = $.trim(search);
        this.pagination.page = 0;
        this.load();
    }

    render (data) {
        let items = data?.items;
        items = Array.isArray(items) ? items : [];
        items = items.map(this.renderItem, this).join('');
        return items
            ? this.resolveTemplate('list', {items})
            : this.resolveTemplate('error', {text: Jam.t('No movie screenings')});
    }

    renderItem (data) {
        const movie = data.movie || {};
        const hall = data.hall || {};
        data.movie = Jam.escape(movie._title);
        data.hall = hall._id;
        data.hallName = Jam.escape(hall._title);
        data.hallDescription = hall.description;
        data.date = data.date ? moment(data.date).format('LT L') : '';
        data.poster = movie.poster;
        data.duration = movie.duration;
        return this.resolveTemplate('item', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    onChangePagination (event, {page}) {
        this.load();
    }

    onDone (data) {
        super.onDone(data);
        this.pagination.setTotal(data?.totalSize);
        this.$content.append(this.pagination.render());
        Jam.t(this.$container);
        $(window).scrollTop(0);
    }
};

Cinema.ScheduleScreeningList = class HallScreeningList extends Cinema.ScreeningList {

    init () {
        super.init();
        this.pagination.pageSize = 9;
        this.load();
    }
};

Cinema.HallScreeningList = class HallScreeningList extends Cinema.ScreeningList {

    init () {
        super.init();
        this.pagination.pageSize = 6;
    }

    getFilter () {
        const data = [{
            attr: 'hall',
            op: 'equal',
            value: this.hall
        }];
        if (this.search) {
            data.push({
                attr: 'movie',
                op: 'nested',
                value: [{
                    attr: 'title',
                    op: 'contains',
                    value: this.search
                }]
            });
        }
        return data;
    }
};