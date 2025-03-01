import styles from "../css/styles.module.scss"
import {useParams} from "react-router";
import {useAppDispatch, useAppSelector} from "../../../hooks/storeHooks";
import {useEffect} from "react";
import {buyingState, loadBuying} from "../../../slices/buying";
import {Spinner} from "../../spinner/Spinner";
import {Hall, SeancePlace} from "../../../types";

export function Buying() {
    const seanceId = Number(useParams()["id"] as string);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadBuying(seanceId));
    }, [seanceId]);
    const {seance, orderPlaces, data: places, error, loading} = useAppSelector(buyingState)
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
                        {toRows(seance.hall, places).map(places => (
                            <div className={styles["buying-scheme__row"]}>
                                {places.map(pl => (
                                        // <span className={styles["buying-scheme__chair"] + " " + styles["buying-scheme__chair_disabled"]}></span>
                                        // <span className={styles["buying-scheme__chair"] + " " + styles["buying-buying-scheme__chair_standart"]}></span>
                                        <span className={styles["buying-scheme__chair"] + " " + styles["buying-scheme__chair_vip"]}></span>
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
                <button className={styles["acceptin-button"]} onClick="location.href='payment.html'">Забронировать</button>
            </section>
        </>
    )
}

function toRows(hall: Hall, places: SeancePlace[]):SeancePlace[][] {
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