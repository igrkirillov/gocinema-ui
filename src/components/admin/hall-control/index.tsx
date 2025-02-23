import {useAppDispatch, useAppSelector} from "../../../hooks";
import {MouseEvent, useEffect} from "react";
import {Error} from "../../error/Error";
import {createNewHall, deleteHall, fetchHalls, hallsState} from "../../../slices/halls";
import styles from "../css/styles.module.scss"

export function HallControl() {
    const dispatch = useAppDispatch();
    const {data: halls, error} = useAppSelector(hallsState);
    useEffect(() => {
        dispatch(fetchHalls())
    }, []) //mounted
    const onDeleteButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const hallId = Number(event.currentTarget.dataset["id"]);
        dispatch(deleteHall(hallId))
    }
    const onCreateButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        dispatch(createNewHall(halls));
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
                    onClick={onCreateButtonClick}>Создать зал</button>
            </>
        );
}