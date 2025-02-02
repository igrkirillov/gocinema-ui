import config from "../config/app.json";
import {Hall} from "./types";

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