import {CurrentPricingData, Hall} from "../types";

export class CurrentPricing {
    id: number | null;
    vipPrice: number;
    standardPrice: number;

    constructor() {
        this.id = null;
        this.vipPrice = 0;
        this.standardPrice = 0;
    }

    fillFromHall(hall: Hall | null): CurrentPricing {
        this.id = hall?.id ?? null;
        this.vipPrice = hall?.vipPrice ?? 0;
        this.standardPrice = hall?.standardPrice ?? 0;
        return this;
    }

    fillFromData(data: CurrentPricingData | null) {
        this.id = data?.id ?? null;
        this.vipPrice = data?.vipPrice ?? 0;
        this.standardPrice = data?.standardPrice ?? 0;
        return this;
    }

    copy(): CurrentPricing {
        const copy = new CurrentPricing();
        copy.id = this.id;
        copy.standardPrice = this.standardPrice;
        copy.vipPrice = this.vipPrice;
        return copy;
    }

    serialize():CurrentPricingData {
        return {
            id: this.id,
            standardPrice: this.standardPrice,
            vipPrice: this.vipPrice
        } as CurrentPricingData;
    }
}