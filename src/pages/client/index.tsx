import "./../../components/client/css/styles.module.scss"
import {Header} from "./../../components/client/header";
import {Outlet} from "react-router";

export function Client() {
    return (
        <>
            <Header></Header>
            <Outlet></Outlet>
        </>
    )
}