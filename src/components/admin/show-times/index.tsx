import styles from "../styles.module.scss"
import "../normalize.css"
import {MouseEvent, useEffect, useState} from "react";
import {MoviePopup} from "../movie-popup";
import {MovieData} from "../../../types";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {fetchMovies, moviesState, saveMovie} from "../../../slices/movies";
import moviePoster from "../../../assets/poster.png"

export function ShowTimes() {
    const [isActiveMoviePopup, setActiveMoviePopup] = useState(false);
    const [currentMovie, setCurrentMovie] = useState({} as MovieData);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchMovies());
    }, []);
    const {data: movies, error} = useAppSelector(moviesState);
    const onAddButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setCurrentMovie({} as MovieData);
        setActiveMoviePopup(true);
    }
    const saveCallback = (data: MovieData): void => {
        dispatch(saveMovie(data))
        setActiveMoviePopup(false);
    }
    const cancelCallback = () => {
        setActiveMoviePopup(false);
    }
    return (
        <>
            <p className={styles["conf-step__paragraph"]}>
                <button className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]}
                    onClick={onAddButtonClick}>Добавить фильм</button>
            </p>
            <div className={styles["conf-step__movies"]}>
                {movies.map(m => (
                    <div className={styles["conf-step__movie"]}>
                        <img className={styles["conf-step__movie-poster"]} alt="poster" src={moviePoster}></img>
                        <h3 className={styles["conf-step__movie-title"]}>{m.name}</h3>
                        <p className={styles["conf-step__movie-duration"]}>{m.duration} минут</p>
                    </div>
                ))}
            </div>
            <MoviePopup data={currentMovie} isActive={isActiveMoviePopup}
                        saveCallback={saveCallback} cancelCallback={cancelCallback}></MoviePopup>
        </>
    )
}