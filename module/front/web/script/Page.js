'use strict';

Cinema.Page = class Page extends Cinema.Element {

    init () {
        this.name = this.dataMap.page;
        this.cinema.on('page:show', this.onPage.bind(this));
    }

    onPage (event, {name}) {
        if (this.name === name) {
            this.activate();
        }
    }

    activate () {
        this.cinema.togglePage(this.name);
    }

    setText (key, text) {
        return this.find(`[data-text="${key}"]`).html(text);
    }
};

Cinema.SchedulePage = class SchedulePage extends Cinema.Page {

    init () {
        super.init();
        this.list = this.getHandler('ScheduleScreeningList');
        this.list.bindSearch(this.getHandler('Search'));
    }
};

Cinema.HallPage = class HallPage extends Cinema.Page {

    init () {
        super.init();
        this.list = this.getHandler('HallScreeningList');
        this.list.bindSearch(this.getHandler('Search'));
        this.cinema.on('action:hall', this.onHall.bind(this));
    }

    activate () {
        this.cinema.togglePage(this.name);
        this.list.load();
    }

    onHall (event, {hall, $hall}) {
        this.list.hall = hall;
        this.setText('hall', $hall.data('name'));
        this.setText('description', $hall.data('description'));
        this.cinema.showPage(this.name);
    }
};

Cinema.ScreeningPage = class ScreeningPage extends Cinema.Page {

    init () {
        super.init();
        this.screening = this.getHandler('Screening');
        this.cinema.on('action:screening', this.onScreening.bind(this));
    }

    activate () {
        this.cinema.toggleLoader(true);
        this.screening.load().always(() => {
            this.setBreadcrumb();
            this.cinema.toggleLoader(false);
            this.cinema.togglePage(this.name);
        });
    }

    onScreening (event, {screening}) {
        this.screening.screening = screening;
        this.cinema.showPage(this.name);
    }

    setBreadcrumb () {
        const data = this.screening.hallData;
        const $hall = this.find('.breadcrumb').find('[data-action="hall"]');
        $hall.attr('data-hall', data._id);
        $hall.data('hall', data._id);
        $hall.data('name', data.name);
        $hall.data('description', data.description);
    }
};