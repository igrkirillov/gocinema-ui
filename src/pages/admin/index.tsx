import {Header} from "./../../components/admin/header";
import "./../../components/admin/css/styles.module.scss"
import {Main} from "./../../components/admin/main";
import {Step} from "./../../components/admin/step";
import {HallControl} from "./../../components/admin/hall-control";
import {HallConfig} from "./../../components/admin/hall-config";
import {Pricing} from "./../../components/admin/pricing";
import {SeanceTimes} from "./../../components/admin/seance-times";
import {OpenSale} from "./../../components/admin/open-sale";
import {useAuth} from "../../hooks/useAuth";
import {useNavigate} from "react-router";
import {useEffect} from "react";
import {ROLE_ADMIN} from "../../constants";

export function Admin() {
    const {user} = useAuth();
    const navigate = useNavigate();
    function isAccessPermit() {
        return user && user.role === ROLE_ADMIN;
    }
    useEffect(() => {
        if (!isAccessPermit()) {
            navigate("/login?backUrl=admin");
        }
    }, [user])
    return isAccessPermit() ? (
        <>
            <Header></Header>
            <Main>
                <Step title="Управление залами">
                    <HallControl></HallControl>
                </Step>
                <Step title="Конфигурация залов">
                    <HallConfig></HallConfig>
                </Step>
                <Step title="Конфигурация цен">
                    <Pricing></Pricing>
                </Step>
                <Step title="Сетка сеансов">
                    <SeanceTimes></SeanceTimes>
                </Step>
                <Step title="Открыть продажи">
                    <OpenSale></OpenSale>
                </Step>
            </Main>
        </>
    ) : (<></>)
}