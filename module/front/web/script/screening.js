'use strict';

Vue.component('screening', {
    props: {
        screening: String
    },
    data () {
        return {
            id: null,
            description: null,
            movie: null,
            poster: null,
            date: null,
            duration: null,
            hall: {},
            seatRows: [],
            selectedSeat: null,
            seatPrice: null,
            ticket: null
        };
    },
    computed: {
        empty () {
            return !this.items.length;
        },
        formattedSelectedSeat () {
            return this.stringifySeat(this.selectedSeat);
        }
    },
    async created () {
        this.$on('load', this.onLoad);
        await this.reload();
    },
    methods: {
        isFreeSeat (id) {
            return !this.soldMap.hasOwnProperty(id);
        },
        onHall (event) {
            this.$root.$emit('hall', this.hall);
        },
        onSeat (id) {
            this.selectedSeat = this.seatMap[id];
            this.seatPrice = this.getPrice(this.selectedSeat);
            this.buyModal = Jam.showModal($(this.$refs.buyModal.$el));
        },
        async onBuy (event) {
            this.buyModal.hide();
            try {
                this.ticket = await this.fetchText('create', {
                    class: 'ticket',
                    view: 'publicCreate',
                    data: {
                        screening: {links: this.screening},
                        seat: {links: this.selectedSeat.id}
                    }
                });
                await this.reload();
                Jam.showModal($(this.$refs.ticketModal.$el));
            } catch (err) {
                this.showError(err);
            }
        },
        stringifySeat (seat) {
            return `${Jam.t('Row')} ${seat?.row} ${Jam.t('Seat')} ${seat?.column}`;
        },
        getPrice (seat) {
            return this.priceMap[seat.id]?.value || this.defaultPrice;
        },
        async reload () {
            await this.load(this.screening);
        },
        async load (id) {
            const data = await this.fetchJson('read', {
                class: 'screening',
                view: 'publicView',
                id
            });
            this.$emit('load', data);
        },
        onLoad (data) {
            this.id = data._id;
            this.movie = data.movie._title;
            this.description = data.movie.description;
            this.poster = this.getThumbnailUrl(data.movie.poster);
            this.date = Jam.FormatHelper.asDate(data.date, 'LT L');
            this.duration = data.movie.duration;
            this.hall = {
                id: data.hall._id,
                description: data.hall.description,
                name: data.hall.name
            };
            this.pricing = data.pricing;
            this.soldMap = Jam.ArrayHelper.index('seat', data.tickets);
            this.defaultPrice = this.pricing?.value;
            this.priceMap = Jam.ArrayHelper.index('seat', this.pricing?.prices);
            this.seats = this.formatSeats(data.hall.seats);
            this.seatMap = Jam.ArrayHelper.index('id', this.seats);
            this.seatRows = this.formatSeatRows();
        },
        formatSeats (items) {
            return items.map(item => ({
                id: item._id,
                row: item.row,
                column: item.column
            }));
        },
        formatSeatRows (items) {
            const data = Jam.ArrayHelper.indexArrays('row', Object.values(this.seatMap));
            return Object.keys(data).sort().map(row => data[row]);
        }
    },
    template: '#screening'
});