'use strict';

const front = new Vue({
    el: '#front',
    props: {
        csrf: String,
        authUrl: String,
        dataUrl: String,
        thumbnailUrl: String,
        userId: String
    },
    propsData: {
        ...document.querySelector('#front').dataset
    },
    data () {
        return {
            activePage: 'schedule',
            activeHall: null,
            activeScreening: null
        };
    },
    computed: {
        activePageProps () {
            switch (this.activePage) {
                case 'hall': return {
                    key: this.activeHall.id,
                    hall: this.activeHall
                };
                case 'screening': return {
                    key: this.activeScreening,
                    screening: this.activeScreening
                };
            }
        }
    },
    created () {
        this.$on('hall', this.onHall);
        this.$on('schedule', this.onSchedule);
        this.$on('screening', this.onScreening);
    },
    methods: {
        onHall (data) {
            this.activePage = 'hall';
            this.activeHall = data;
        },
        onSchedule () {
            this.activePage = 'schedule';
        },
        onScreening (data) {
            this.activePage = 'screening';
            this.activeScreening = data;
        }
    }
});