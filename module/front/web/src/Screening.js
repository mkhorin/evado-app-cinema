/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Cinema.Screening = class Screening extends Cinema.Loadable {

    init () {
        super.init();
        this.on('click', '.seat.free', this.onSeat.bind(this));
        this.$ticketModal = this.find('.ticket.modal');
        this.$buyModal = this.find('.buy.modal');
        this.$buyModal.find('[data-action="buy"]').click(this.onBuy.bind(this));
    }

    getPostData () {
        return {
            class: 'screening',
            view: 'publicView',
            id: this.screening
        };
    }

    getPrice (seat) {
        seat = typeof seat === 'object' ? seat._id : seat;
        return this.priceMap.hasOwnProperty(seat)
            ? this.priceMap[seat].value
            : this.defaultPrice;
    }

    onSeat (event) {
        this.seat = this.seatMap[$(event.currentTarget).data('seat')];
        this.setModalAttr('seat', this.seat._title, this.$buyModal);
        this.setModalAttr('price', this.getPrice(this.seat), this.$buyModal);
        this.setModalAttr('seat', this.seat._title, this.$ticketModal);
        this.$buyModal.find('.alert').hide();
        this.buyModal = Jam.showModal(this.$buyModal);
    }

    render (data) {
        const pricing = data.pricing || {};
        const movie = data.movie || {};
        const hall = data.hall || {};
        const seats = hall.seats;

        this.soldMap = Jam.ArrayHelper.index('seat', data.tickets);
        this.defaultPrice = pricing.value;
        this.priceMap = Jam.ArrayHelper.index('seat', pricing.prices);

        data.movie = Jam.StringHelper.escapeTags(movie._title);
        data.poster = movie.poster;
        data.duration = movie.duration;
        data.description = Jam.StringHelper.escapeTags(movie.description);
        data.date = data.date ? moment(data.date).format('LT L') : '';
        data.hall = Jam.StringHelper.escapeTags(hall._title);
        data.seats = this.renderSeats(seats);
        this.setModalAttrs(data, this.$buyModal);
        this.setModalAttrs(data, this.$ticketModal);
        this.hallData = hall;
        return this.resolveTemplate('item', data);
    }

    renderSeats (items) {
        this.seatMap = Jam.ArrayHelper.index('_id', items);
        const data = Jam.ArrayHelper.indexArrays('row', items);
        const rows = Object.keys(data).sort();
        const result = [];
        for (const row of rows) {
            result.push(this.renderSeatRow(data[row]));
        }
        return result.join('');
    }

    renderSeatRow (items) {
        const result = [];
        for (const item of items) {
            result.push(this.renderSeat(item));
        }
        const seats = result.join('');
        return this.resolveTemplate('seatRow', {seats});
    }

    renderSeat (data) {
        data.state = this.soldMap.hasOwnProperty(data._id) ? '' : 'free';
        return this.resolveTemplate('seat', data);
    }

    renderError () {
        const text = super.renderError(...arguments);
        return this.resolveTemplate('error', {text});
    }

    setModalAttrs (data, $modal) {
        for (const key of Object.keys(data)) {
            this.setModalAttr(key, data[key], $modal);
        }
    }

    setModalAttr (name, value, $modal) {
        $modal.find(`[data-id="${name}"]`).html(value);
    }

    onBuy () {
        this.cinema.toggleLoader(true);
        return this.cinema.ajaxQueue
            .post(this.dataMap.create, this.getBuyData())
            .done(this.onBuyDone.bind(this))
            .fail(this.onBuyFail.bind(this));
    }

    onBuyDone (data) {
        this.cinema.toggleLoader(false);
        this.buyModal?.hide();
        this.ticketModal = Jam.showModal(this.$ticketModal);
        this.$ticketModal.find('[data-id="ticket"]').html(data);
        this.find(`[data-seat="${this.seat._id}"]`).removeClass('free');
    }

    onBuyFail () {
        this.cinema.toggleLoader(false);
        this.$buyModal.find('.alert').show();
    }

    getBuyData () {
        return {
            class: 'ticket',
            view: 'publicCreate',
            data: {
                screening: {links: [this.screening]},
                seat: {links: [this.seat._id]}
            }
        };
    }
};