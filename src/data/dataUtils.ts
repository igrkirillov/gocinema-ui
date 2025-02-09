import {Hall} from "../types";

export function getHallByIdOrThrow(id: number | null, halls: Hall[]): Hall {
    const hall = halls.find(h => h.id === id);
    if (!hall) {
        throw Error(`Hall with id ${id} not found`);
    }
    return hall;
}