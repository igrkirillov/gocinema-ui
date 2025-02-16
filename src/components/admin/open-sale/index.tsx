import styles from "../styles.module.scss"
import "../normalize.css"
export function OpenSale(props) {
    return (
        <div className={styles["textCenter"]}>
            <p className={styles["conf-step__paragraph"]}>Всё готово, теперь можно:</p>
            <button className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]}>
                Открыть продажу билетов
            </button>
        </div>
    )
}