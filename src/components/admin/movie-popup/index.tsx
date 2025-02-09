import styles from "../styles.module.scss";
import popupClose from "../../../assets/close.png";
import {MovieData} from "../../../types";

export function MoviePopup(props: {data: MovieData, isActive: boolean}) {
    const {data, isActive} = props;
    return (
        <div className={styles["popup"] + " " + (isActive ? styles["active"] : "")}>
            <div className={styles["popup__container"]}>
                <div className={styles["popup__content"]}>
                    <div className={styles["popup__header"]}>
                        <h2 className={styles["popup__title"]}>
                            {data.id ? "Редактирование фильма" : "Добавление фильма"}
                            <a className={styles["popup__dismiss"]}>
                                <img src={popupClose}/>
                            </a>
                        </h2>
                    </div>
                    <div className={styles["popup__wrapper"]}>
                        <form>
                            <div className={styles["popup__container"]}>
                                <div className={styles["popup__poster"]}></div>
                                <div className={styles["popup__form"]}>
                                    <label className={styles["conf-step__label"] + " " + styles["conf-step__label-fullsize"]}
                                           htmlFor="name">
                                        Название фильма
                                        <input className={styles["conf-step__input"]} type="text"
                                               placeholder="Например, «Гражданин Кейн»" name="name" required
                                               value={data.name}></input>
                                    </label>
                                    <label className={styles["conf-step__label"] +" "+ styles["conf-step__label-fullsize"]} htmlFor="name">
                                        Продолжительность фильма (мин.)
                                        <input className={styles["conf-step__input"]} type="text" name="duration"
                                               data-last-value="" required
                                               value={data.duration}></input>
                                    </label>
                                    <label className={styles["conf-step__label"] + " " + styles["conf-step__label-fullsize"]} htmlFor="name">
                                        Описание фильма
                                        <textarea className={styles["conf-step__input"]} name="description" required>
                                            {data.description}
                                        </textarea>
                                    </label>
                                    <label className={styles["conf-step__label"] + " " + styles["conf-step__label-fullsize"]} htmlFor="name">
                                        Страна
                                        <input className={styles["conf-step__input"]} type="text" name="duration"
                                               data-last-value="" required
                                            value={data.country}></input>
                                    </label>
                                </div>
                            </div>
                            <div className={styles["conf-step__buttons"] + " " + styles["text-center"]}>
                                <input type="submit" value={data.id ? "Сохранить фильм" : "Добавить фильм"}
                                       className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]} data-event="film_add"></input>
                                <input type="submit" value="Загрузить постер"
                                       className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]}></input>
                                <button className={styles["conf-step__button"] + " " +styles["conf-step__button-regular"]} type="button">Отменить</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}