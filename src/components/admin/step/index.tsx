import styles from "../css/styles.module.scss"
import {PropsWithChildren, MouseEvent} from "react";

export function Step(props: PropsWithChildren<{title: string}>) {
    const {title, children} = props;
    const onHeaderClick = (event: MouseEvent<HTMLBaseElement>) => {
        event.preventDefault();
        event.currentTarget.classList.toggle(styles["conf-step__header_opened"]);
        event.currentTarget.classList.toggle(styles["conf-step__header_closed"]);
    }
    return (
        <section className={styles["conf-step"]}>
            <header className={styles["conf-step__header"] + " " + styles["conf-step__header_opened"]} onMouseDown={onHeaderClick}>
                <h2 className={styles["conf-step__title"]}>{title}</h2>
            </header>
            <div className={styles["conf-step__wrapper"]}>
                {children}
            </div>
        </section>
    )
}