import styles from "../css/styles.module.scss";
import popupClose from "../../../assets/close.png";
import {Hall} from "../../../types";
import {FormEvent, MouseEvent, useEffect, useRef} from "react";

export function HallPopup(props: {
    data: Hall,
    isActive: boolean,
    saveCallback: (data: Hall) => void,
    cancelCallback: () => void}) {
    const {data, isActive, saveCallback, cancelCallback} = props;
    const onSubmitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        data.name = formData.get("name") as string;
        data.rows = Number(formData.get("rows"));
        data.cols = Number(formData.get("cols"));
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
    return (
        <div className={styles["popup"] + " " + (isActive ? styles["active"] : "")}>
            <div className={styles["popup__container"]}>
                <div className={styles["popup__content"]}>
                    <div className={styles["popup__header"]}>
                        <h2 className={styles["popup__title"]}>
                            {data.id ? "Редактирование зала" : "Добавление зала"}
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
                                        Название зала
                                        <input className={styles["conf-step__input"]} type="text"
                                               placeholder="Например, Вандамм" name="name" required
                                               defaultValue={data.name}
                                               ref={inputNameRef}></input>
                                    </label>
                                    <label className={styles["conf-step__label"] +" "+ styles["conf-step__label-fullsize"]} htmlFor="rows">
                                        Кол-во рядов
                                        <input className={styles["conf-step__input"]} type="number" name="rows"
                                               required
                                               defaultValue={data.rows}></input>
                                    </label>
                                    <label className={styles["conf-step__label"] + " " + styles["conf-step__label-fullsize"]} htmlFor="cols">
                                        Кол-во мест в ряду
                                        <input className={styles["conf-step__input"]} type="number" name="cols"
                                        required
                                        defaultValue={data.cols}></input>
                                    </label>
                                </div>
                            </div>
                            <div className={styles["conf-step__buttons"] + " " + styles["text-center"]}>
                                <input type="submit" value={data.id ? "Сохранить зал" : "Добавить зал"}
                                       className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]} data-event="film_add"></input>
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