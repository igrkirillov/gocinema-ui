import {useAppDispatch, useAppSelector} from "../../../hooks/storeHooks";
import {MouseEvent, useEffect, useState} from "react";
import {Error} from "../../error/Error";
import {createHall, deleteHall, fetchHalls, hallsState} from "../../../slices/halls";
import styles from "../css/styles.module.scss"
import {validateEditAndNotice} from "../../../noticeUtils";
import {useEditAvailable} from "../../../hooks/useEditAvailable";
import {Hall} from "../../../types";
import {HallPopup} from "../hall-popup";
import {DEFAULT_COLS, DEFAULT_ROWS} from "../../../constants";

export function HallControl() {
    const isEditAvailable = useEditAvailable();
    const dispatch = useAppDispatch();
    const {data: halls, error} = useAppSelector(hallsState);
    useEffect(() => {
        dispatch(fetchHalls())
    }, []) //mounted
    const [isActiveHallPopup, setActiveHallPopup] = useState(false);
    const [currentHall, setCurrentHall] = useState({} as Hall);
    const onAddHallButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (!validateEditAndNotice(isEditAvailable)) {
            return;
        }
        event.preventDefault();
        setCurrentHall({
            cols: DEFAULT_COLS,
            rows: DEFAULT_ROWS
        } as Hall);
        setActiveHallPopup(true);
    }
    const saveHallCallback = (data: Hall): void => {
        dispatch(createHall(data))
        setActiveHallPopup(false);
    }
    const cancelHallCallback = () => {
        setActiveHallPopup(false);
    }
    const onDeleteButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (!validateEditAndNotice(isEditAvailable)) {
            return;
        }
        event.preventDefault();
        const hallId = Number(event.currentTarget.dataset["id"]);
        dispatch(deleteHall(hallId))
    }
    return error ? (<Error error={error}/>) : (
            <>
                <p className={styles["conf-step__paragraph"]}>Доступные залы:</p>
                <ul className={styles["conf-step__list"]}>
                    {halls.map(hall => (
                        <li key={hall.id}>{hall.name} <span> </span>
                            <button className={styles["conf-step__button"] + " " + styles["conf-step__button-trash"]}
                                onClick={onDeleteButtonClick}
                                data-id={hall.id}></button>
                        </li>
                    ))}
                </ul>
                <button className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]}
                    onClick={onAddHallButtonClick}>Создать зал</button>
                {isActiveHallPopup
                    ? (<HallPopup data={currentHall} isActive={isActiveHallPopup}
                                   saveCallback={saveHallCallback} cancelCallback={cancelHallCallback}></HallPopup>)
                    : (<></>)}
            </>
        );
}