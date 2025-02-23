import styles from "../css/styles.module.scss"
import poster from "./poster1.jpg"
import {DayItem} from "../../../types";
export type MovieProps = {
    dayItem: DayItem
}
export function Movie(props: MovieProps) {
    const {movie, halls, timesMap} = props.dayItem
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
                <div className={styles["movie-seances__hall"]}>
                    <h3 className={styles["movie-seances__hall-title"]}>{h.name}</h3>
                    <ul className={styles["movie-seances__list"]}>
                        <li className={styles["movie-seances__time-block"]}>
                            <a className={styles["movie-seances__time"]} href="hall.html">10:20</a>
                        </li>
                        <li className={styles["movie-seances__time-block"]}>
                            <a className={styles["movie-seances__time"]} href="hall.html">14:10</a>
                        </li>
                        <li className={styles["movie-seances__time-block"]}>
                            <a className={styles["movie-seances__time"]} href="hall.html">18:40</a>
                        </li>
                        <li className={styles["movie-seances__time-block"]}>
                            <a className="movie-seances__time" href="hall.html">22:00</a>
                        </li>
                    </ul>
                </div>
            ))}
        </section>
    )
}