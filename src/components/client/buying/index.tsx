import styles from "../css/styles.module.scss"
import {useParams} from "react-router";
import {useAppDispatch, useAppSelector} from "../../../hooks/storeHooks";
import {MouseEvent, useEffect} from "react";
import {addOrderPlace, buyingState, loadBuying, removeOrderPlace} from "../../../slices/buying";
import {Spinner} from "../../spinner/Spinner";
import {Hall, SeancePlace} from "../../../types";
import {updateCurrentHall} from "../../../slices/halls";

export function Buying() {
    const seanceId = Number(useParams()["id"] as string);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadBuying(seanceId));
    }, [seanceId]);
    const {seance, orderPlaces, data: places, error, loading} = useAppSelector(buyingState)
    const onPlaceClick = (event: MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        const id = Number(event.currentTarget.dataset["id"]);
        const orderedIndex = orderPlaces.findIndex(o => o.id === id);
        if (orderedIndex >= 0) {
            dispatch(removeOrderPlace(orderPlaces[orderedIndex]));
        } else {
            dispatch(addOrderPlace(places.find(pl => pl.id === id) as SeancePlace));
        }
    }
    const onBookClick = (event: MouseEvent<HTMLButtonElement>) => {

    }
    return loading || !seance.id ? (<Spinner></Spinner>) : (
        <>
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
                                        <span key={pl.id} className={styles["buying-scheme__chair"] + " " + getStyleClass(pl, orderPlaces)}
                                        onClick={isClickablePlace(pl) ? onPlaceClick : (() => {})}
                                        data-id={pl.id}
                                        style={{"cursor": isClickablePlace(pl) ? "pointer" : ""}}></span>
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
        </>
    )
}

function toRowArrays(hall: Hall, places: SeancePlace[]):SeancePlace[][] {
    const rows = [];
    for (let row = 0; row < hall.rows; ++row) {
        const cols = [];
        for (let col = 0; col < hall.cols; ++col) {
            cols.push(places.find(pl => pl.hallPlace.row === row && pl.hallPlace.col === col));
        }
        rows.push(cols);
    }
    return rows as SeancePlace[][];
}

function getStyleClass(place: SeancePlace, orderedPlaces: SeancePlace[]): string {
    const isOrdered = orderedPlaces.findIndex(o => o.id === place.id) >= 0;
    if (isOrdered) {
        return styles["buying-scheme__chair_selected"];
    } else if (place.hallPlace.isBlocked) {
        return styles["buying-scheme__chair_disabled"];
    } else if (place.isBooked) {
        return styles["buying-scheme__chair_taken"];
    } else if (place.hallPlace.isVip) {
        return styles["buying-scheme__chair_vip"];
    } else {
        return styles["buying-scheme__chair_standart"];
    }
}

function isClickablePlace(place: SeancePlace): boolean {
    return !place.isBooked && !place.hallPlace.isBlocked;
}