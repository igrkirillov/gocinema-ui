import styles from "../css/styles.module.scss"
import poster from "./poster1.jpg"
import {DayItem} from "../../../types";
import {MouseEvent} from "react";
import {useNavigate} from "react-router";
import {dateToISOFormat} from "../../../data/dataUtils";

export type MovieProps = {
    dayItem: DayItem,
    date: number
}
export function Movie(props: MovieProps) {
    const {movie, halls, timesMap} = props.dayItem
    const {date} = props;
    const navigate = useNavigate();
    const onClickSeanceTimeClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const seanceId = event.currentTarget.dataset["id"] as string;
        navigate(`/client/seances/${seanceId}/${dateToISOFormat(date)}`)
    }
    return (
        <section className={styles["movie"]}>
            <div className={styles["movie__info"]}>
                <div className={styles["movie__poster"]}>
                    <img className={styles["movie__poster-image"]} alt={movie.name} src={poster}></img>
                </div>
                <div className={styles["movie__description"]}>
                    <h2 className={styles["movie__title"]}>{movie.name}</h2>
                    <p className={styles["movie__synopsis"]}>{movie.description}</p>
                    <p className={styles["movie__data"]}>
                        <span className={styles["movie__data-duration"]}>{movie.duration} минут</span>
                        <span className={styles["movie__data-origin"]}>{movie.country}</span>
                    </p>
                </div>
            </div>

            {halls.map(h => (
                <div key={h.id} className={styles["movie-seances__hall"]}>
                    <h3 className={styles["movie-seances__hall-title"]}>{h.name}</h3>
                    <ul className={styles["movie-seances__list"]}>
                        {timesMap[h.id].map(s => (
                            <li key={s.id} className={styles["movie-seances__time-block"]}>
                                <a className={styles["movie-seances__time"]}
                                   data-id={s.id}
                                   href="#"
                                   onClick={onClickSeanceTimeClick}>{s.start}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    )
}