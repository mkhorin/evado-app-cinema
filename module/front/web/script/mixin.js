'use strict';

Vue.mixin({
    data () {
        return {
            loading: false
        };
    },
    mounted () {
        this.translateElement();
    },
    updated () {
        this.translateElement();
    },
    methods: {
        isGuest () {
            return !this.$root.userId;
        },
        getDataUrl (action) {
            return `${this.$root.dataUrl}/${action}`;
        },
        getThumbnailUrl (id, size = 'sm') {
            return id ? `${this.$root.thumbnailUrl}&s=${size}&id=${id}` : null;
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
        fetchText () {
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