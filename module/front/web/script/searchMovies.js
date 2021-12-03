'use strict';

Vue.component('search-movies', {
    data () {
        return {
            text: ''
        };
    },
    methods: {
        onInput () {
            if (!this.text) {
                this.onSubmit();
            }
        },
        onSubmit () {
            this.$emit('search', this.text);
        }
    },
    template: '#search-movies'
});