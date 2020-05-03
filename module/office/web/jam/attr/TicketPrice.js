'use strict';

Jam.TicketPriceModelAttr = class TicketPrice extends Jam.ModelAttr {

    init () {
        super.init();
        this.screeningAttr = this.model.getAttr('screening');
        this.seatAttr = this.model.getAttr('seat');
        this.seatAttr.$value.change(this.onChangeSeat.bind(this));
        this.$displayValue = this.$value.next();
    }

    onChangeSeat (event) {
        this.seatAttr.getValue() ? this.loadPrice() : this.setNotSetValue();
    }

    loadPrice () {
        this.setDisplayValue(Jam.FormatHelper.asSpinner());
        $.post('/api/base/data/read', {
            class: 'screening',
            view: 'publicView',
            id: this.screeningAttr.getLinkedValue()
        }).done(this.onDonePrice.bind(this))
          .fail(this.onFailPrice.bind(this));
    }

    onDonePrice (data) {
        const value = this.parsePricing(data);
        isNaN(value) ? this.setNotSetValue() : this.setDisplayValue(value);
    }

    onFailPrice () {
        this.setDisplayValue(Jam.FormatHelper.asInvalidData());
    }

    setNotSetValue () {
        this.setDisplayValue(Jam.FormatHelper.asNotSet());
    }

    setDisplayValue (value) {
        this.$displayValue.html(value);
    }

    parsePricing (data) {
        data = data && data.pricing;
        if (!data) {
            return null;
        }
        let value = data.value;
        if (Array.isArray(data.prices)) {
            const seat = this.seatAttr.getLinkedValue();
            for (const item of data.prices) {
                if (item.seat === seat) {
                    value = item.value;
                }
            }
        }
        return value;
    }
};