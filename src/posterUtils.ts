import config from "../config/app.json"
export function getFullPosterUrl(posterUrl: string) {
    return config.serverUrl + posterUrl;
}