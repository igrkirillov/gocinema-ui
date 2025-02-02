import styles from "../styles.module.scss"
import {PropsWithChildren} from "react";
export function Main(props: PropsWithChildren) {
    const {children} = props;
    return (
        <main className={styles["conf-steps"]}>
            {children}
        </main>
    )
}