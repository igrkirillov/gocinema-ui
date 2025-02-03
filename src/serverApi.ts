import config from "../config/app.json";
import {Hall, HallParameters} from "./types";

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