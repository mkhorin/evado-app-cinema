'use strict';

Vue.mixin({
    data () {
        return {
            loading: false
        };
    },
    computed: {
        isGuest () {
            return !this.$root.userId;
        }
    },
    mounted () {
        this.translateElement();
    },
    updated () {
        this.translateElement();
    },
    methods: {
        getDataUrl (action) {
            return `${this.$root.dataUrl}/${action}`;
        },
        getThumbnailUrl (id, size = 'sm') {
            return `${this.$root.thumbnailUrl}&s=${size}&id=${id}`;
        },
        getRefArray (name) {
            const data = this.$refs[name];
            return Array.isArray(data) ? data : data ? [data] : [];
        },
        getValueTitle (key, data) {
            const item = data[key];
            if (item?.hasOwnProperty('_title')) {
                return item._title;
            }
            return data.hasOwnProperty(`${key}_title`) ? data[`${key}_title`] : item;
        },
        fetchJson () {
            return this.fetchByMethod('getJson', ...arguments);
        },
        fetchText (url, data) {
            return this.fetchByMethod('getText', ...arguments);
        },
        fetchByMethod (name, action, data) {
            try {
                const csrf = this.$root.csrf;
                this.loading = true;
                return (new Jam.Fetch)[name](this.getDataUrl(action), {csrf, ...data});
            } finally {
                this.loading = false;
            }
        },
        requireAuth () {
            if (this.isGuest()) {
                location.assign(this.$root.authUrl);
                return false;
            }
            return true;
        },
        toSchedule () {
            this.$root.$emit('schedule');
        },
        translateElement () {
            Jam.i18n.translate($(this.$el));
        },
        showError () {
            Jam.dialog.error(...arguments);
        }
    }
});

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