import {Header} from "./header";
import "./css/styles.module.scss"
import {Main} from "./main";
import {Step} from "./step";
import {HallControl} from "./hall-control";
import {HallConfig} from "./hall-config";
import {Pricing} from "./pricing";
import {SeanceTimes} from "./seance-times";
import {OpenSale} from "./open-sale";

export function Admin() {
    return (
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
    )
}