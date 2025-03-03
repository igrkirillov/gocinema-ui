import styles from "../css/styles.module.scss"
import "../css/normalize.css"
import {useAppDispatch, useAppSelector} from "../../../hooks/storeHooks";
import {closeSale, fetchOptions, openSale, optionsState} from "../../../slices/options";
import {Error} from "../../error/Error";
import {Spinner} from "../../spinner/Spinner";
import {MouseEvent, useEffect} from "react";
import {hallsState} from "../../../slices/halls";
import {seancesState} from "../../../slices/seances";
import {CurrentHall} from "../../../data/CurrentHall";
import {isAllDataSaved} from "../../../data/dataUtils";

export function OpenSale() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchOptions());
    }, [])
    const {isSaleOpened, error, loading} = useAppSelector(optionsState);
    const {currentHalls, currentPricings} = useAppSelector(hallsState)
    const {currentTimeline} = useAppSelector(seancesState)
    const isReadyForOpenSale = isAllDataSaved(currentHalls, currentPricings, currentTimeline);

    const onOpenButtonClick = function (event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        dispatch(openSale());
    }
    const onCloseButtonClick = function (event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        dispatch(closeSale());
    }
    return error ? (<Error error={error}></Error>) : (
        <div className={styles["text-center"]}>
            {!isSaleOpened
                ? (isReadyForOpenSale
                    ? (<p className={styles["conf-step__paragraph"]}>Всё готово, теперь можно:</p>)
                    : (<p className={styles["conf-step__paragraph"]}>Действие "Открыть продажи" недоступно - сначала завершите конфигурирование залов</p>))
                : (<p className={styles["conf-step__paragraph"]}>Чтобы закрыть продажи, нажмите кнопку ниже:</p>)}
            {isSaleOpened
                ? (
                    <button className={styles["conf-step__button"] + " " + styles["conf-step__button-stop"]}
                            onClick={onCloseButtonClick}>
                        Приостановить продажу билетов
                    </button>
                )
                : (
                    <button className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]}
                            onClick={onOpenButtonClick}
                            disabled={!isReadyForOpenSale}>
                        Открыть продажу билетов
                    </button>
                )}
        </div>
    )
}