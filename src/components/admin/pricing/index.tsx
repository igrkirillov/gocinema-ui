import {useAppDispatch, useAppSelector, useCurrentPricing} from "../../../hooks/hooks";
import {ChangeEvent, MouseEvent, useEffect} from "react";
import {Error} from "../../error/Error";
import {cancelCurrentPricing, hallsState, saveCurrentPricing, updateCurrentPricing} from "../../../slices/halls";
import styles from "../css/styles.module.scss"
// import "../css/normalize.css"
import {CurrentPricing} from "../../../data/CurrentPricing";

export function Pricing() {
    const {data: halls, error, currentPricings} = useAppSelector(hallsState);
    const dispatch = useAppDispatch();
    const [currentPricing, setCurrentPricing] = useCurrentPricing(
        halls.length > 0 ? new CurrentPricing().fillFromHall(halls[0]) : null);
    // перерисовывать компонент при изменении модели
    useEffect(() => {
        // если currentPricing ещё не задан, тогда будет текущим halls[0], иначе существующий currentPricing просто рефрешим
        setCurrentPricing(!currentPricing?.id && halls.length > 0
            ? new CurrentPricing().fillFromHall(halls[0])
            : new CurrentPricing().fillFromHall(halls.find((hall) => hall.id === currentPricing?.id) ?? null));
    }, [halls]);
    const onHallSwitcherChange = (event: ChangeEvent<HTMLInputElement>) => {
        const hallId = Number(event.currentTarget.dataset["id"]);
        // currentPricing берём из хранилища изменённых залов, если он там есть, если нету - создаём новый
        setCurrentPricing(
            currentPricing && currentPricing.id && currentPricings.findIndex(h => h.id === hallId) >= 0
                ? new CurrentPricing().fillFromData(currentPricings.find(h => h.id === hallId) ?? null)
                : new CurrentPricing().fillFromHall(halls.find((hall) => hall.id === hallId) ?? null));
    }
    const onStandardPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (currentPricing) {
            currentPricing.standardPrice = Number(event.currentTarget.value);
            const newCurrentPricing = currentPricing.copy();
            setCurrentPricing(newCurrentPricing);
            dispatch(updateCurrentPricing(newCurrentPricing.serialize()));
        }
    }
    const onVipPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (currentPricing) {
            currentPricing.vipPrice = Number(event.currentTarget.value);
            const newCurrentPricing = currentPricing.copy();
            setCurrentPricing(newCurrentPricing);
            dispatch(updateCurrentPricing(newCurrentPricing.serialize()));
        }
    }
    const onSaveClick = (event: MouseEvent<HTMLInputElement>) => {
        if (currentPricing) {
            event.preventDefault();
            dispatch(saveCurrentPricing(currentPricing.serialize()));
        }
    }
    const onCancelClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (currentPricing) {
            event.preventDefault();
            dispatch(cancelCurrentPricing(currentPricing.serialize()));
            setCurrentPricing(new CurrentPricing().fillFromHall(halls.find(h => h.id === currentPricing.id) ?? null));
        }
    }
    const isButtonsEnabled = currentPricings.filter(h => h.id === currentPricing?.id).length != 0;
    return error ? (<Error error={error}/>) : (
        <>
            <p className={styles["conf-step__paragraph"]}>Выберите зал для конфигурации:</p>
            <ul className={styles["conf-step__selectors-box"]}>
                {halls.map(h => (
                    <li key={h.id}><input type="radio" className={styles["conf-step__radio"]} name="pricings-hall"
                                          value={h.name}
                                          checked={currentPricing?.id === h.id}
                                          onChange={onHallSwitcherChange}
                                          data-id={h.id}>
                        </input>
                        <span className={styles["conf-step__selector"]}>{h.name}</span>
                    </li>))}
            </ul>
            <p className={styles["conf-step__paragraph"]}>Установите цены для типов кресел:</p>
            <div className={styles["conf-step__legend"]}>
                <label className={styles["conf-step__label"]}>Цена, рублей
                    <input type="text" className={styles["conf-step__input"]} placeholder="0"
                        value={currentPricing?.standardPrice}
                        onChange={onStandardPriceChange}></input>
                </label>
                за <span className={styles["conf-step__chair"] + " " + styles["conf-step__chair_standart"]}></span> обычные кресла
            </div>
            <div className={styles["conf-step__legend"]}>
                <label className={styles["conf-step__label"]}>Цена, рублей
                    <input type="text" className={styles["conf-step__input"]} placeholder="0"
                        value={currentPricing?.vipPrice}
                        onChange={onVipPriceChange}></input>
                </label>
                за <span className={styles["conf-step__chair"] + " " + styles["conf-step__chair_vip"]}></span> VIP кресла
            </div>
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