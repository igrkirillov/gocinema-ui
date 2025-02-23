import "./css/styles.module.scss"
import {Header} from "./header";
import {Main} from "./main";
import {Movie} from "./movie";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {clientState, fetchDaySeances, dayItems} from "../../slices/client";

export function Client() {
    const dispatch = useAppDispatch();
    const {currentDate} = useAppSelector(clientState);
    const items = useAppSelector(dayItems);
    useEffect(() => {
        dispatch(fetchDaySeances(currentDate))
    }, [currentDate]);
    return (
        <>
            <Header></Header>
            <Main>
                {items.map(item => (<Movie dayItem={item}></Movie>))}
            </Main>
        </>
    )
}