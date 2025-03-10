import styles from "../admin/css/styles.module.scss";

export function Error(props: {error: string}) {
    const {error} = props;
    return (
        <div className={styles["text-center"]}>
            {error ? (<span className={styles["login__input"]} style={{"color": "red", "border": "0px"}}>{error}</span>) : null}
        </div>
    )
}