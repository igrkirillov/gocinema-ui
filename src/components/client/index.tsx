import "./css/styles.module.scss"
import {Header} from "./header";
import {Outlet} from "react-router";

export function Client() {
    return (
        <>
            <Header></Header>
            <Outlet></Outlet>
        </>
    )
}