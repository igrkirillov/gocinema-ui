import styles from "../styles.module.scss"
import "../normalize.css"
import {MouseEvent, useState} from "react";
import {MoviePopup} from "../movie-popup";
import {MovieData} from "../../../types";

export function ShowTimes() {
    const [isActiveMoviePopup, setActiveMoviePopup] = useState(false);
    const [currentMovie, setCurrentMovie] = useState({} as MovieData);
    const onAddButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setCurrentMovie({} as MovieData);
        setActiveMoviePopup(true);
    }
    return (
        <>
            <p className={styles["conf-step__paragraph"]}>
                <button className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]}
                    onClick={onAddButtonClick}>Добавить фильм</button>
            </p>
            <MoviePopup data={currentMovie} isActive={isActiveMoviePopup}></MoviePopup>
        </>
    )
}