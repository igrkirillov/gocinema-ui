import styles from "../css/styles.module.scss"
import {useNavigate} from "react-router";
import {MouseEvent} from "react";

export function Header() {
    const navigate = useNavigate();
    function onClickToAdminPage(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        navigate("/admin")
    }
    function onClickToClientPage(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        navigate("/client")
    }
    return (
        <header className={styles["page-header"]} style={{"display": "flex", "alignItems": "center", "justifyContent": "space-between"}}>
            <a href="#" onClick={onClickToClientPage} style={{"textDecoration":"none"}}>
                <h1 className={styles["page-header__title"]}>Идём<span>в</span>кино</h1>
            </a>
            <a href="#" style={{"display": "block", "backgroundColor":"white"}} onClick={onClickToAdminPage}>В АДМИНКУ</a>
        </header>
    )
}