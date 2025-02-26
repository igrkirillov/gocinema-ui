import styles from "../css/styles.module.scss"
import {MouseEvent} from "react";
import {useNavigate} from "react-router";
export function Header() {
    const navigate = useNavigate();
    function onClickToClientPage(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        navigate("/client")
    }
    return (
        <header className={styles["page-header"]} style={{"display": "flex", "alignItems": "center", "justifyContent": "space-between"}}>
            <div>
                <h1 className={styles["page-header__title"]}>Идём<span>в</span>кино</h1>
                <span className={styles["page-header__subtitle"]}>Администраторская</span>
            </div>
            <a href={"/client"} style={{"display": "block", "backgroundColor":"white"}} onClick={onClickToClientPage}>В магазин</a>
        </header>
    )
}