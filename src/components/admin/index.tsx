import {Header} from "./header";
import "./styles.module.scss"
import {Main} from "./main";
import {Step} from "./step";

export function Admin() {
    return (
        <>
            <Header></Header>
            <Main>
                <Step title="Управление залами">
                    <span>Text</span>
                </Step>
                <Step title="Конфигурация залов">
                    <span>Text</span>
                </Step>
                <Step title="Конфигурация цен">
                    <span>Text</span>
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