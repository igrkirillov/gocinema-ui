import styles from "../css/styles.module.scss"
import {useNavigate, useParams} from "react-router";
import {useAppDispatch, useAppSelector} from "../../../hooks/storeHooks";
import {MouseEvent, useEffect} from "react";
import {addOrderPlace, bookTicket, buyingState, loadBuying, removeOrderPlace} from "../../../slices/buying";
import {Spinner} from "../../spinner/Spinner";
import {BookedPlace, Hall, Place} from "../../../types";

export function Buying() {
    const seanceId = Number(useParams()["id"] as string);
    const seanceDate = useParams()["date"] as string;
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadBuying({seanceId: seanceId, seanceDate: seanceDate}));
    }, [seanceId]);
    const navigate = useNavigate();
    const {seance, orderPlaces, data: bookedPlaces, error, loading, bookedTicket} = useAppSelector(buyingState);
    const places = seance ? seance.hall.places : [];
    useEffect(() => {
        // если билет есть и он не оплачен, тогда перейти на форму оплаты
        if (bookedTicket && !bookedTicket.isPayed) {
            navigate(`/client/tickets/${bookedTicket.id}`)
        }
    }, [bookedTicket]);
    const onPlaceClick = (event: MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        const id = Number(event.currentTarget.dataset["id"]);
        const orderedIndex = orderPlaces.findIndex(o => o.id === id);
        if (orderedIndex >= 0) {
            dispatch(removeOrderPlace(orderPlaces[orderedIndex]));
        } else {
            dispatch(addOrderPlace(places.find(pl => pl.id === id) as Place));
        }
    }
    const onBookClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        dispatch(bookTicket());
    }
    return loading || !seance ? (<Spinner></Spinner>) : (
        <section className={styles["buying"]}>
            <div className={styles["buying__info"]}>
                <div className={styles["buying__info-description"]}>
                    <h2 className={styles["buying__info-title"]}>{seance.movie.name}</h2>
                    <p className={styles["buying__info-start"]}>Начало сеанса: {seance.start}</p>
                    <p className={styles["buying__info-hall"]}>Зал: {seance.hall.name}</p>
                </div>
                <div className={styles["buying__info-hint"]}>
                    <p>Тапните дважды,<br></br>чтобы увеличить</p>
                </div>
            </div>
            <div className={styles["buying-scheme"]}>
                <div className={styles["buying-scheme__wrapper"]}>
                    {toRowArrays(seance.hall, places).map((places, row) => (
                        <div key={row} className={styles["buying-scheme__row"]}>
                            {places.map(pl => (
                                    <span key={pl.id} className={styles["buying-scheme__chair"] + " " + getStyleClass(pl, orderPlaces, bookedPlaces)}
                                    onClick={isClickablePlace(pl, bookedPlaces) ? onPlaceClick : (() => {})}
                                    data-id={pl.id}
                                    style={{"cursor": isClickablePlace(pl, bookedPlaces) ? "pointer" : ""}}></span>
                                ))
                           }
                        </div>
                    ))}
                </div>
                <div className={styles["buying-scheme__legend"]}>
                    <div className={styles["col"]}>
                        <p className={styles["buying-scheme__legend-price"]}><span
                            className={styles["buying-scheme__chair"] + " " + styles["buying-scheme__chair_standart"]}></span> Свободно (<span
                            className={styles["buying-scheme__legend-value"]}>250</span>руб)</p>
                        <p className={styles["buying-scheme__legend-price"]}><span
                            className={styles["buying-scheme__chair"] + " " + styles["buying-scheme__chair_vip"]}></span> Свободно VIP (<span
                            className={styles["buying-scheme__legend-value"]}>350</span>руб)</p>
                    </div>
                    <div className={styles["col"]}>
                        <p className={styles["buying-scheme__legend-price"]}><span
                            className={styles["buying-scheme__chair"] + " " + styles["buying-scheme__chair_taken"]}></span> Занято</p>
                        <p className={styles["buying-scheme__legend-price"]}><span
                            className={styles["buying-scheme__chair"] + " " + styles["buying-scheme__chair_selected"]}></span> Выбрано</p>
                    </div>
                </div>
            </div>
            <button disabled={orderPlaces.length == 0} className={styles["acceptin-button"]} onClick={onBookClick}>Забронировать</button>
        </section>
    )
}

function toRowArrays(hall: Hall, places: Place[]): Place[][] {
    const rows = [];
    for (let row = 0; row < hall.rows; ++row) {
        const cols = [];
        for (let col = 0; col < hall.cols; ++col) {
            cols.push(places.find(pl => pl.row === row && pl.col === col));
        }
        rows.push(cols);
    }
    return rows as Place[][];
}

function getStyleClass(place: Place, orderedPlaces: Place[], bookedPlaces: BookedPlace[]): string {
    const isOrdered = orderedPlaces.findIndex(o => o.id === place.id) >= 0;
    if (isOrdered) {
        return styles["buying-scheme__chair_selected"];
    } else if (place.isBlocked) {
        return styles["buying-scheme__chair_disabled"];
    } else if (isBooked(place, bookedPlaces)) {
        return styles["buying-scheme__chair_taken"];
    } else if (place.isVip) {
        return styles["buying-scheme__chair_vip"];
    } else {
        return styles["buying-scheme__chair_standart"];
    }
}

function isBooked(place: Place, bookedPlaces: BookedPlace[]) {
    return bookedPlaces.some(bp => bp.hallPlace.row === place.row && bp.hallPlace.col === place.col);
}

function isClickablePlace(place: Place, bookedPlaces: BookedPlace[]): boolean {
    return !isBooked(place, bookedPlaces) && !place.isBlocked;
}