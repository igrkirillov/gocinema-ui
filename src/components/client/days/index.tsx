import styles from "../css/styles.module.scss"
import {useEffect, useState, MouseEvent} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {clientState, setCurrentDate} from "../../../slices/client";
import {getSixDays} from "../../../data/dataUtils";
import {DAY_NAMES} from "../../../constants";
export function Days() {
    const dispatch = useAppDispatch();
    const {currentDate} = useAppSelector(clientState);
    useEffect(() => {
        dispatch(setCurrentDate(new Date().getTime()));
    }, []);
    const [days, setDays] = useState(getSixDays(new Date().getTime()));
    const onDayClick = (event: MouseEvent<HTMLAnchorElement>) => {
        const day = Number(event.currentTarget.dataset["day"]);
        dispatch(setCurrentDate(day));
    }
    const onNextDaysClick = () => {
        const lastDay = days[5];
        setDays(getSixDays(lastDay))
        dispatch(setCurrentDate(lastDay));
    }
    return (
        <nav className={styles["page-nav"]}>
            {days.map(day => (
                <a className={styles["page-nav__day"] + " " +
                    (new Date(day).getDate() === new Date().getDate() ? styles["page-nav__day_today"] : "") + " " +
                    (new Date(day).getDate() === new Date(currentDate).getDate() ? styles["page-nav__day_chosen"] : "")}
                   href="#"
                   data-day={day}
                    onClick={onDayClick}>
                    <span className={styles["page-nav__day-week"]}>{DAY_NAMES[new Date(day).getDay()]}</span>
                    <span className={styles["page-nav__day-number"]}>{new Date(day).getDate()}</span>
                </a>
            ))}
            <a className={styles["page-nav__day"] + " " + styles["page-nav__day_next"]} href="#"
                onClick={onNextDaysClick}>
            </a>
        </nav>
    )
}