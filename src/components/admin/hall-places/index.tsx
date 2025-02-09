import styles from "../styles.module.scss"
import {CurrentHall} from "../../../data/CurrentHall";

export function HallPlaces(props: {currentHall: CurrentHall | null}) {
    const {currentHall} = props;
    return (
        <div className={styles["conf-step__hall"]}>
            <div className={styles["conf-step__hall-wrapper"]}>
                {
                    Array(currentHall?.rows).fill(0).map((_, index) => index).map((row) => {
                        return (
                            <div key={row} className={styles["conf-step__row"]}>
                                {Array(currentHall?.cols).fill(0).map((_, index) => index).map((col) => {
                                    return (<span key={col} className={styles["conf-step__chair"] + " " +
                                        (isBlocked(row, col, currentHall) ? styles["conf-step__chair_disabled"] : "") + " " +
                                        (isVip(row, col, currentHall) ? styles["conf-step__chair_vip"] : "") + " " +
                                        (isStandard(row, col, currentHall) ? styles["conf-step__chair_standard"] : "")}></span>)
                                })}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

function isBlocked(row: number, col: number, currentHall: CurrentHall | null): boolean {
    return !!currentHall && !!currentHall.places && currentHall.places.length != 0
        && !!currentHall.places.filter(place => place.row === row && place.col === col && place.isBlocked);
}

function isVip(row: number, col: number, currentHall: CurrentHall | null): boolean {
    return !!currentHall && !!currentHall.places && currentHall.places.length != 0
        && !!currentHall.places.filter(place => place.row === row && place.col === col && place.isVip);
}

function isStandard(row: number, col: number, currentHall: CurrentHall | null): boolean {
    return !isVip(row, col, currentHall) && !isBlocked(row, col, currentHall);
}