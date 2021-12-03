'use strict';

Vue.component('hall', {
    props: {
        hall: Object,
        pageSize: {
            type: Number,
            default: 6
        }
    },
    data () {
        return {
            items: [],
            searchText: null
        };
    },
    computed: {
        empty () {
            return !this.items.length;
        }
    },
    async created () {
        this.$on('load', this.onLoad);
        await this.reload();
    },
    methods: {
        onBuy (id) {
            this.$root.$emit('screening', id);
        },
        onSearch (text) {
            this.searchText = text;
            this.reload();
        },
        async reload () {
            await this.load(0);
        },
        async load (page) {
            const data = await this.fetchJson('list', {
                class: 'screening',
                view: 'publicList',
                length: this.pageSize,
                start: page * this.pageSize,
                filter: this.getFilter()
            });
            const pageSize = this.pageSize;
            this.$emit('load', {...data, pageSize, page});
        },
        getFilter () {
            const result = [this.getHallFilter()];
            if (this.searchText) {
                result.push(this.getSearchFilter());
            }
            return result;
        },
        getHallFilter () {
            return {
                attr: 'hall',
                op: 'equal',
                value: this.hall.id
            };
        },
        getSearchFilter () {
            return {
                attr: 'movie',
                op: 'nested',
                value: [{
                    attr: 'title',
                    op: 'contains',
                    value: this.searchText
                }]
            };
        },
        onLoad ({items}) {
            this.items = this.formatItems(items);
        },
        formatItems (items) {
            return items.map(item => ({
                id: item._id,
                movie: item.movie?._title,
                date: Jam.FormatHelper.asDate(item.date, 'LT L'),
                duration: item.movie?.duration,
                hall: item.hall?._id,
                hallName: item.hall?._title,
                hallDescription: item.hall?.description,
                poster: this.getThumbnailUrl(item.movie?.poster)
            }));
        },
    },
    template: '#hall'
});