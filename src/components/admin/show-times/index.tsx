import styles from "../styles.module.scss"
import "../normalize.css"
import {MouseEvent, useEffect, useState} from "react";
import {MoviePopup} from "../movie-popup";
import {Movie, MovieData, Seance, SeanceData} from "../../../types";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {fetchMovies, moviesState, saveMovie} from "../../../slices/movies";
import moviePoster from "../../../assets/poster.png"
import {toMovieData, toSeanceData} from "../../../data/dataUtils";
import {MINUTE_TO_PX} from "../../../constants";
import {fetchSeances, saveSeance, seancesState} from "../../../slices/seances";
import {hallsState} from "../../../slices/halls";
import {Time} from "../../../data/Time";
import {SeancePopup} from "../seance-popup";

export function ShowTimes() {
    const [isActiveMoviePopup, setActiveMoviePopup] = useState(false);
    const [isActiveSeancePopup, setActiveSeancePopup] = useState(false);
    const [currentMovie, setCurrentMovie] = useState({} as MovieData);
    const [currentSeance, setCurrentSeance] = useState({} as SeanceData);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchMovies());
        dispatch(fetchSeances());
    }, []);
    const {data: movies, error: moviesError} = useAppSelector(moviesState);
    const {data: seances, error: seancesError} = useAppSelector(seancesState);
    const {data: halls, error: hallsError} = useAppSelector(hallsState);
    const onAddButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setCurrentMovie({} as MovieData);
        setActiveMoviePopup(true);
    }
    const saveMovieCallback = (data: MovieData): void => {
        dispatch(saveMovie(data))
        setActiveMoviePopup(false);
    }
    const cancelMovieCallback = () => {
        setActiveMoviePopup(false);
    }
    const saveSeanceCallback = (data: SeanceData): void => {
        dispatch(saveSeance(data))
        setActiveSeancePopup(false);
    }
    const cancelSeanceCallback = () => {
        setActiveSeancePopup(false);
    }
    const onMovieClick = (movie: Movie): void => {
        setCurrentMovie(toMovieData(movie));
        setActiveMoviePopup(true);
    }
    const onSeanceClick = (seance: Seance): void => {
        setCurrentSeance(toSeanceData(seance));
        setActiveSeancePopup(true);
    }
    const onNewSeanceClick = (): void => {
        setCurrentSeance(toSeanceData(null));
        setActiveSeancePopup(true);
    }

    return (
        <>
            <p className={styles["conf-step__paragraph"]}>
                <button className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]}
                    onClick={onAddButtonClick}>Добавить фильм</button>
            </p>
            <div className={styles["conf-step__movies"]}>
                {movies.map(m => (
                    <div key={m.id} data-id={m.id} className={styles["conf-step__movie"]}
                         onClick={() => onMovieClick(m)} >
                        <img className={styles["conf-step__movie-poster"]} alt="poster" src={moviePoster}></img>
                        <h3 className={styles["conf-step__movie-title"]}>{m.name}</h3>
                        <p className={styles["conf-step__movie-duration"]}>{m.duration} минут</p>
                    </div>
                ))}
            </div>
            {halls.map(h => {
                return (
                    <div className={styles["conf-step__seances"]}>
                        <div className={styles["conf-step__seances-hall"]}>
                            <h3 className={styles["conf-step__seances-title"]}>{h.name}</h3>
                            <div className={styles["conf-step__seances-timeline"]}
                                onClick={(event: MouseEvent<HTMLDivElement>) => {
                                        event.preventDefault();
                                        onNewSeanceClick();
                                    }
                            }>
                                {seances
                                    .filter(s => s.hall.id === h.id)
                                    .sort((s1,s2) => new Time().fillFromString(s1.start)
                                        .compare(new Time().fillFromString(s2.start)))
                                    .map(s => {
                                        return (
                                            <div className={styles["conf-step__seances-movie"]}
                                                 onClick={(event: MouseEvent<HTMLDivElement>) => {
                                                     event.preventDefault();
                                                     event.stopPropagation();
                                                     onSeanceClick(s)
                                                 }}
                                                 style={{"width": `${minuteToPixels(s.movie.duration)}px`,
                                                     "backgroundColor": "rgb(133, 255, 137)",
                                                     "left": `${minuteToPixels(new Time().fillFromString(s.start).toMinutes())}px`}}>
                                                <p className={styles["conf-step__seances-movie-title"]}>{s.movie.name}</p>
                                                <p className={styles["conf-step__seances-movie-start"]}>{s.start}</p>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    </div>
                )
            })}
            {isActiveSeancePopup
                ? (<SeancePopup data={currentSeance} isActive={isActiveSeancePopup}
                               saveCallback={saveSeanceCallback} cancelCallback={cancelSeanceCallback}></SeancePopup>)
                : (<></>)}
            {isActiveMoviePopup
                ? (<MoviePopup data={currentMovie} isActive={isActiveMoviePopup}
                               saveCallback={saveMovieCallback} cancelCallback={cancelMovieCallback}></MoviePopup>)
                : (<></>)}
        </>
    )
}

function minuteToPixels(mm: number): number {
    return +Number(mm * MINUTE_TO_PX).toFixed(0);
}
