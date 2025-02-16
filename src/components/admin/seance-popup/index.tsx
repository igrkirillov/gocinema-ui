import styles from "../styles.module.scss";
import popupClose from "../../../assets/close.png";
import {Hall, Movie, SeanceData} from "../../../types";
import {FormEvent, MouseEvent, useEffect, useRef} from "react";
import {useAppSelector} from "../../../hooks";
import {moviesState} from "../../../slices/movies";
import {hallsState} from "../../../slices/halls";
import {Time} from "../../../data/Time";
import {formatTime} from "../../../data/dataUtils";

export function SeancePopup(props: {
    data: SeanceData,
    isActive: boolean,
    saveCallback: (data: SeanceData) => void,
    deleteCallback: (data: SeanceData) => void,
    cancelCallback: () => void}) {
    const {data, isActive, saveCallback, cancelCallback, deleteCallback} = props;
    const {data: movies} = useAppSelector(moviesState)
    const {data: halls} = useAppSelector(hallsState)
    const onSubmitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        data.hall = halls.find(h => h.id == Number(formData.get("hall"))) as Hall;
        data.movie = movies.find(m => m.id == Number(formData.get("movie"))) as Movie;
        data.start = new Time().fillFromString(formData.get("start") as string);
        saveCallback(data);
        event.currentTarget.reset();
    }
    const onCancelButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        cancelCallback();
    }
    const onCloseLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        cancelCallback();
    }
    const onDeleteButtonClick = (event: MouseEvent<HTMLInputElement>) => {
        event.preventDefault();
        deleteCallback(data);
    }
    const selectMoviesRef = useRef<HTMLSelectElement>(null);
    useEffect(() => {
        selectMoviesRef.current?.focus();
    })
    return (
        <div className={styles["popup"] + " " + (isActive ? styles["active"] : "")}>
            <div className={styles["popup__container"]}>
                <div className={styles["popup__content"]}>
                    <div className={styles["popup__header"]}>
                        <h2 className={styles["popup__title"]}>
                            {data.id ? "Редактирование сеанса" : "Добавление сеанса"}
                            <a className={styles["popup__dismiss"]} onClick={onCloseLinkClick}>
                                <img src={popupClose}/>
                            </a>
                        </h2>
                    </div>
                    <div className={styles["popup__wrapper"]}>
                        <form onSubmit={onSubmitForm}>
                            <div className={styles["popup__container"]}>
                                <div className={styles["popup__poster"]}></div>
                                <div className={styles["popup__form"]}>
                                    <label className={styles["conf-step__label"] + " " + styles["conf-step__label-fullsize"]}
                                           htmlFor="name">
                                        Зал
                                        <select className={styles["conf-step__input"]} name="hall" required
                                                defaultValue={data?.hall?.id}
                                                ref={selectMoviesRef}>
                                            {halls.map(h => (<option key={h.id} value={h.id}>{h.name}</option>))}
                                        </select>
                                    </label>
                                    <label className={styles["conf-step__label"] +" "+ styles["conf-step__label-fullsize"]} htmlFor="duration">
                                        Фильм
                                        <select className={styles["conf-step__input"]} name="movie" required
                                                defaultValue={data?.movie?.id}>
                                            {movies.map(m => (<option key={m.id} value={m.id}>{m.name}</option>))}
                                        </select>
                                    </label>
                                    <label className={styles["conf-step__label"] + " " + styles["conf-step__label-fullsize"]} htmlFor="country">
                                        Время начала
                                        <input className={styles["conf-step__input"]} type="time" name="start"
                                               required defaultValue={formatTime(data.start)}></input>
                                    </label>
                                </div>
                            </div>
                            <div className={styles["conf-step__buttons"] + " " + styles["text-center"]}>
                                <input type="submit" value={data.id ? "Сохранить фильм" : "Добавить фильм"}
                                       className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]} data-event="film_add"></input>
                                {data.id ? (
                                    <input type="submit" value="Снять сеанс"
                                           className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]}
                                        onClick={onDeleteButtonClick}></input>
                                ) : null}
                                <button className={styles["conf-step__button"] + " " +styles["conf-step__button-regular"]} type="button"
                                        onClick={onCancelButtonClick}>Отменить</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}