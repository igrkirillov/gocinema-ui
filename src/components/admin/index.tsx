import {Header} from "./header";
import "./styles.module.scss"
import {Main} from "./main";
import {Step} from "./step";
import {HallControl} from "./hall-control";
import {HallConfig} from "./hall-config";
import {Pricing} from "./pricing";

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
                    <span>Text</span>
                </Step>
                <Step title="Открыть продажи">
                    <span>Text</span>
                </Step>
            </Main>
        </>
    )
}