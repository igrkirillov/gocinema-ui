import {useAppDispatch, useAppSelector} from "../../../hooks";
import {ChangeEvent, useEffect, useState, MouseEvent} from "react";
import {Error} from "../../error/Error";
import {cancelCurrentHall, hallsState, saveCurrentHall, updateCurrentHall} from "../../../slices/halls";
import styles from "../styles.module.scss"
import "../normalize.css"
import {HallPlaces} from "../hall-places";
import {CurrentHall} from "../../../data/CurrentHall";

export function HallConfig() {
    const {data: halls, error, currentHalls} = useAppSelector(hallsState);
    const dispatch = useAppDispatch();
    const [currentHall, setCurrentHall] = useState(halls.length > 0 ? new CurrentHall(halls[0]) : null);
    // перерисовывать компонент при изменении модели
    useEffect(() => {
        // если currentHall ещё не задан, тогда будет текущим halls[0], иначе существующий currentHall просто рефрешим
        setCurrentHall(!currentHall?.id && halls.length > 0
            ? new CurrentHall(halls[0])
            : new CurrentHall(halls.find((hall) => hall.id === currentHall?.id) ?? null));
    }, [halls]);
    const onHallSwitcherChange = (event: ChangeEvent<HTMLInputElement>) => {
        const hallId = Number(event.currentTarget.dataset["id"]);
        // currentHall берём из хранилища изменённых залов, если он там есть, если нету - создаём новый
        setCurrentHall(
            currentHall && currentHall.id && currentHalls.findIndex(h => h.id === hallId) >= 0
                ? currentHalls.find(h => h.id === hallId) ?? null
                : new CurrentHall(halls.find((hall) => hall.id === hallId) ?? null));
    }
    const onHallRowsChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (currentHall) {
            currentHall.rows = Number(event.currentTarget.value);
            setCurrentHall(currentHall.copy().refill());
            dispatch(updateCurrentHall(currentHall));
        }
    }
    const onHallColsChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (currentHall) {
            currentHall.cols = Number(event.currentTarget.value);
            setCurrentHall(currentHall.copy().refill());
            dispatch(updateCurrentHall(currentHall));
        }
    }
    const onSaveClick = (event: MouseEvent<HTMLInputElement>) => {
        if (currentHall) {
            event.preventDefault();
            dispatch(saveCurrentHall(currentHall));
        }
    }
    const onCancelClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (currentHall) {
            event.preventDefault();
            dispatch(cancelCurrentHall(currentHall));
            setCurrentHall(new CurrentHall(halls.find(h => h.id === currentHall.id) ?? null));
        }
    }
    const isButtonsEnabled = currentHalls.filter(h => h.id === currentHall?.id).length != 0;
    return error ? (<Error error={error}/>) : (
        <>
            <p className={styles["conf-step__paragraph"]}>Выберите зал для конфигурации:</p>
            <ul className={styles["conf-step__selectors-box"]}>
                {halls.map(h => (
                    <li key={h.id}><input type="radio" className={styles["conf-step__radio"]} name="chairs-hall"
                                          value={h.name}
                                          checked={currentHall?.id === h.id}
                                          onChange={onHallSwitcherChange}
                                          data-id={h.id}>
                        </input>
                        <span className={styles["conf-step__selector"]}>{h.name}</span>
                    </li>))}
            </ul>
            <p className={styles["conf-step__paragraph"]}>Укажите количество рядов и максимальное количество кресел в ряду:</p>
            <div className={styles["conf-step__legend"]}>
                <label className={styles["conf-step__label"]}>
                    Рядов, шт
                    <input type="text" className={styles["conf-step__input"]} placeholder="?"
                           value={currentHall?.rows}
                           onChange={onHallRowsChange}></input>
                </label>
                <span className={styles["multiplier"]}>x</span>
                <label className={styles["conf-step__label"]}>Мест, шт
                    <input type="text" className={styles["conf-step__input"]} placeholder="?"
                           value={currentHall?.cols}
                           onChange={onHallColsChange}></input>
                </label>
            </div>
            <p className={styles["conf-step__paragraph"]}>Теперь вы можете указать типы кресел на схеме зала:</p>
            <div className={styles["conf-step__legend"]}>
                <span className={styles["conf-step__chair"] + " " + styles["conf-step__chair_standart"]}></span> — обычные кресла
                <span className={styles["conf-step__chair"] + " " + styles["conf-step__chair_vip"]}></span> — VIP кресла
                <span className={styles["conf-step__chair"] + " " + styles["conf-step__chair_disabled"]}></span> — заблокированные (нет кресла)
                <p className={styles["conf-step__hint"]}>Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
            </div>
            <HallPlaces currentHall={currentHall}></HallPlaces>
            <fieldset className={styles["conf-step__buttons"] + " " + styles["text-center"]}>
                <button className={styles["conf-step__button"] + " " + styles["conf-step__button-regular"]}
                    disabled={!isButtonsEnabled}
                    onClick={onCancelClick}>Отмена</button>
                <input type="submit" value="Сохранить" className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]}
                    disabled={!isButtonsEnabled}
                    onClick={onSaveClick}></input>
            </fieldset>
        </>
        );
}