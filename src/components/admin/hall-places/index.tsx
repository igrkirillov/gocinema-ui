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
                                    return (<span key={col} className={styles["conf-step__chair"] + " " + styles["conf-step__chair_disabled"]}></span>)
                                })}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}