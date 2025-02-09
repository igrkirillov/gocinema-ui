import config from "../config/app.json";
import {CurrentHallData, CurrentPricingData, Hall, HallParameters, PlaceParameters} from "./types";

export async function getAllHalls(): Promise<Hall[]> {
    const response = await fetch(config.serverUrl + "/halls", {method: "GET"});
    if (response.ok) {
        return await response.json() as Hall[];
    } else {
        throw Error(response.statusText);
    }
}

export async function deleteHallById(hallId: number) {
    const response = await fetch(config.serverUrl + "/halls/" + hallId, {method: "DELETE"});
    if (!response.ok) {
        throw Error(response.statusText);
    }
}

export async function createNextHall(allHalls: Hall[]): Promise<Hall> {
    const maxNumber = allHalls.map(h => Number(h.name.substring(4, h.name.length)))
        .reduce((prev, current) => Math.max(prev, current), 0);
    const response = await fetch(config.serverUrl + "/halls",
        {
                method: "POST",
                body: JSON.stringify({name: `Зал ${maxNumber + 1}`, cols: 0, rows: 0} as HallParameters),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
    if (response.ok) {
        return await response.json() as Hall;
    } else {
        throw Error(response.statusText);
    }
}

export async function saveHall(currentHall: CurrentHallData, hall: Hall): Promise<void> {
    const response = await fetch(config.serverUrl + "/halls/" + currentHall.id,
        {
            method: "PATCH",
            body: JSON.stringify({
                name: currentHall.name,
                cols: currentHall.cols,
                rows: currentHall.rows,
                places: currentHall.places?.map(p => {
                    return {
                        row: p.row,
                        col: p.col,
                        isVip: p.isVip,
                        isBlocked: p.isBlocked
                    } as PlaceParameters
                }),
                standardPrice: hall.standardPrice,
                vipPrice: hall.vipPrice} as HallParameters),
            headers: {
                'Content-Type': 'application/json'
            },
        });
    if (!response.ok) {
        throw Error(response.statusText);
    }
}

export async function savePricing(currentPricing: CurrentPricingData, hall: Hall): Promise<void> {
    const response = await fetch(config.serverUrl + "/halls/" + currentPricing.id,
        {
            method: "PATCH",
            body: JSON.stringify({
                name: hall.name,
                cols: hall.cols,
                rows: hall.rows,
                places: hall.places?.map(p => {
                    return {
                        row: p.row,
                        col: p.col,
                        isVip: p.isVip,
                        isBlocked: p.isBlocked
                    } as PlaceParameters
                }),
                standardPrice: currentPricing.standardPrice,
                vipPrice: currentPricing.vipPrice} as HallParameters),
            headers: {
                'Content-Type': 'application/json'
            },
        });
    if (!response.ok) {
        throw Error(response.statusText);
    }
}