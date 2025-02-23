import styles from "../css/styles.module.scss"
export function Header() {
    return (
        <header className={styles["page-header"]}>
            <h1 className={styles["page-header__title"]}>Идём<span>в</span>кино</h1>
            <span className={styles["page-header__subtitle"]}>Администраторская</span>
        </header>
    )
}