import {useAppDispatch, useAppSelector} from "../../../hooks";
import {useEffect} from "react";
import {Spinner} from "../../spinner/Spinner";
import {Error} from "../../error/Error";
import {fetchHalls, hallsState} from "../../../slices/halls";
import styles from "../styles.module.scss"

export function HallControl() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchHalls())
    }, []) //mounted
    const {loading, data: halls, error} = useAppSelector(hallsState);
    return loading
        ? (<Spinner/>)
        : (error ? (<Error error={error}/>) : (
            <>
                <p className={styles["conf-step__paragraph"]}>Доступные залы:</p>
                <ul className={styles["conf-step__list"]}>
                    {halls.map(hall => (
                        <li>{hall.name} <span> </span>
                            <button className={styles["conf-step__button"] + " " + styles["conf-step__button-trash"]}></button>
                        </li>
                    ))}
                </ul>
                <button className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]}>Создать зал</button>
            </>
        ));
}