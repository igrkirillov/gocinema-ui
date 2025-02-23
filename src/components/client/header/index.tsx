import styles from "../css/styles.module.scss"
export function Header() {
    return (
        <>
            <header className={styles["page-header"]}>
                <h1 className={styles["page-header__title"]}>Идём<span>в</span>кино</h1>
            </header>
            <nav className={styles["page-nav"]}>
                <a className={styles["page-nav__day"] + " " + styles["page-nav__day_today"]} href="#">
                    <span className={styles["page-nav__day-week"]}>Пн</span><span className={styles["page-nav__day-number"]}>31</span>
                </a>
                <a className={styles["page-nav__day"]} href="#">
                    <span className={styles["page-nav__day-week"]}>Вт</span><span className={styles["page-nav__day-number"]}>1</span>
                </a>
                <a className={styles["page-nav__day"] + " " + styles["page-nav__day_chosen"]} href="#">
                    <span className={styles["page-nav__day-week"]}>Ср</span><span className={styles["page-nav__day-number"]}>2</span>
                </a>
                <a className={styles["page-nav__day"]} href="#">
                    <span className={styles["page-nav__day-week"]}>Чт</span><span className={styles["page-nav__day-number"]}>3</span>
                </a>
                <a className={styles["page-nav__day"]} href="#">
                    <span className={styles["page-nav__day-week"]}>Пт</span><span className={styles["page-nav__day-number"]}>4</span>
                </a>
                <a className={styles["page-nav__day"] + " " + styles["page-nav__day_weekend"]} href="#">
                    <span className={styles["page-nav__day-week"]}>Сб</span><span className={styles["page-nav__day-number"]}>5</span>
                </a>
                <a className={styles["page-nav__day"] + " " + styles["page-nav__day_next"]} href="#">
                </a>
            </nav>
        </>
    )
}