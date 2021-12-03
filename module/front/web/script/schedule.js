'use strict';

Vue.component('schedule', {
    props: {
        pageSize: {
            type: Number,
            default: 9
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
        onHall (event) {
            this.$root.$emit('hall', {...event.currentTarget.dataset});
        },
        onScreening (event) {
            this.$root.$emit('screening', event.currentTarget.dataset.id);
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
                filter:  this.getFilter(),
                length: this.pageSize,
                start: page * this.pageSize
            });
            const pageSize = this.pageSize;
            this.$emit('load', {...data, pageSize, page});
        },
        getFilter () {
            if (this.searchText) {
                return [{
                    attr: 'movie',
                    op: 'nested',
                    value: [{
                        attr: 'title',
                        op: 'contains',
                        value: this.searchText
                    }]
                }];
            }
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
                poster: this.getThumbnailUrl(item.movie?.poster, 'sm')
            }));
        },
    },
    template: '#schedule'
});