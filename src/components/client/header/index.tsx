import styles from "../css/styles.module.scss"
import {useNavigate} from "react-router";
import {MouseEvent} from "react";

export function Header() {
    const navigate = useNavigate();
    function onClickToAdminPage(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        navigate("/admin")
    }
    return (
        <header className={styles["page-header"]} style={{"display": "flex", "alignItems": "center", "justifyContent": "space-between"}}>
            <h1 className={styles["page-header__title"]}>Идём<span>в</span>кино</h1>
            <a href={"/admin"} style={{"display": "block", "backgroundColor":"white"}} onClick={onClickToAdminPage}>В АДМИНКУ</a>
        </header>
    )
}