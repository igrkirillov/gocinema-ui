import styles from "../css/styles.module.scss";
import popupClose from "../../../assets/close.png";
import {MovieData} from "../../../types";
import {ChangeEvent, FormEvent, MouseEvent, useEffect, useRef, useState} from "react";

export function MoviePopup(props: {
    data: MovieData,
    isActive: boolean,
    saveCallback: (data: MovieData) => void,
    cancelCallback: () => void}) {
    const {data, isActive, saveCallback, cancelCallback} = props;
    const onSubmitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        data.name = formData.get("name") as string;
        data.description = formData.get("description") as string;
        data.country = formData.get("country") as string;
        data.duration = Number(formData.get("duration"));
        data.posterFile = posterFile;
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
    const inputNameRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        inputNameRef.current?.focus();
    })
    const [posterFile, setPosterFile] = useState(data.posterFile);
    const posterFileRef = useRef<HTMLInputElement>(null);
    const onPosterClick = (event: MouseEvent<HTMLInputElement>) => {
        event.preventDefault();
        posterFileRef.current?.click();
    }
    const onPosterFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPosterFile(event.currentTarget.files ? event.currentTarget.files[0] : null);
    }
    return (
        <div className={styles["popup"] + " " + (isActive ? styles["active"] : "")}>
            <div className={styles["popup__container"]}>
                <div className={styles["popup__content"]}>
                    <div className={styles["popup__header"]}>
                        <h2 className={styles["popup__title"]}>
                            {data.id ? "Редактирование фильма" : "Добавление фильма"}
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
                                        Название фильма
                                        <input className={styles["conf-step__input"]} type="text"
                                               placeholder="Например, «Гражданин Кейн»" name="name" required
                                               defaultValue={data.name}
                                               ref={inputNameRef}></input>
                                    </label>
                                    <label className={styles["conf-step__label"] +" "+ styles["conf-step__label-fullsize"]} htmlFor="duration">
                                        Продолжительность фильма (мин.)
                                        <input className={styles["conf-step__input"]} type="text" name="duration"
                                               required
                                               defaultValue={data.duration}></input>
                                    </label>
                                    <label className={styles["conf-step__label"] + " " + styles["conf-step__label-fullsize"]} htmlFor="description">
                                        Описание фильма
                                        <textarea className={styles["conf-step__input"]} name="description" required
                                            defaultValue={data.description}/>
                                    </label>
                                    <label className={styles["conf-step__label"] + " " + styles["conf-step__label-fullsize"]} htmlFor="country">
                                        Страна
                                        <input className={styles["conf-step__input"]} type="text" name="country"
                                               defaultValue={data.country}></input>
                                    </label>
                                    <label style={{"width": "0", "height": "0"}}>
                                        <input type="file" ref={posterFileRef} style={{"width": "0", "height": "0"}} accept="image/*"
                                               onChange={onPosterFileChange}/>
                                    </label>
                                </div>
                            </div>
                            <div className={styles["conf-step__buttons"] + " " + styles["text-center"]}>
                                <input type="submit" value={data.id ? "Сохранить фильм" : "Добавить фильм"}
                                       className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]} data-event="film_add"></input>
                                <input type="submit" value={posterFile ? "Постер выбран" : "Выбрать постер"}
                                       className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]}
                                        onClick={onPosterClick}></input>
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