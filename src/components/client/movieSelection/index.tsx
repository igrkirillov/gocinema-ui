import {Main} from "./../main";
import {Movie} from "./../movie";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks/storeHooks";
import {clientState, dayItems, fetchDaySeances} from "../../../slices/client";
import {Days} from "./../days";

export function MovieSelection() {
    const dispatch = useAppDispatch();
    const {currentDate} = useAppSelector(clientState);
    const items = useAppSelector(dayItems);
    useEffect(() => {
        dispatch(fetchDaySeances(currentDate))
    }, [currentDate]);
    return (
        <>
            <Days></Days>
            <Main>
                {items.map(item => (<Movie key={item.movie.id} dayItem={item}></Movie>))}
            </Main>
        </>
    )
}