'use strict';

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

Cinema.Pagination = class Pagination {

    constructor (list) {
        this.list = list;
        this.page = 0;
        this.pageSize = 10;
        this.list.on('click', '.pagination [data-action="first"]', this.onFirst.bind(this));
        this.list.on('click', '.pagination [data-action="prev"]', this.onPrev.bind(this));
        this.list.on('click', '.pagination [data-action="next"]', this.onNext.bind(this));
        this.list.on('click', '.pagination [data-action="last"]', this.onLast.bind(this));
        this.list.on('click', '.pagination [data-page]', this.onPage.bind(this));
    }

    isValidPage (page) {
        return Number.isInteger(page) && page >= 0 && page < this.numPages;
    }

    getOffset () {
        return this.page * this.pageSize;
    }

    getPageSize () {
        return this.pageSize;
    }

    onFirst (event) {
        event.preventDefault();
        this.setPage(0);
    }

    onPrev (event) {
        event.preventDefault();
        this.setPage(this.page - 1);
    }

    onLast (event) {
        event.preventDefault();
        this.setPage(this.numPages - 1);
    }

    onNext (event) {
        event.preventDefault();
        this.setPage(this.page + 1);
    }

    onPage (event) {
        event.preventDefault();
        this.setPage(event.target.dataset.page);
    }

    setPage (page) {
        page = Number(page);
        if (page !== this.page && this.isValidPage(page)) {
            this.page = page;
            this.list.trigger('change:pagination', {page});
        }
    }

    setTotal (total) {
        total = Number.isInteger(total) ? total : 0;
        this.numPages = Math.ceil(total / this.pageSize);
    }

    render () {
        if (this.numPages < 2) {
            return '';
        }
        const template = this.list.getTemplate('pagination');
        const pages = this.renderPages();
        return Cinema.resolveTemplate(template, {pages});
    }

    renderPages () {
        const template = this.list.getTemplate('page');
        const result = [];
        for (let page = 0; page < this.numPages; ++page) {
            const active = page === this.page ? 'active' : '';
            const text = page + 1;
            result.push(Cinema.resolveTemplate(template, {active, page, text}));
        }
        return result.join('');
    }
};