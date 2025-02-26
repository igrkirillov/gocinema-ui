import styles from "../css/styles.module.scss"
import "../css/normalize.css"
import {MouseEvent, useEffect, useState} from "react";
import {MoviePopup} from "../movie-popup";
import {Movie, MovieData, SeanceData} from "../../../types";
import {useAppDispatch, useAppSelector} from "../../../hooks/storeHooks";
import {fetchMovies, moviesState, saveMovie} from "../../../slices/movies";
import moviePoster from "../../../assets/poster.png"
import {formatTime, toMovieData, toSeanceData} from "../../../data/dataUtils";
import {MINUTE_TO_PX} from "../../../constants";
import {fetchSeances, saveCurrentTimeline, seancesState, setCurrentTimeline} from "../../../slices/seances";
import {hallsState} from "../../../slices/halls";
import {Time} from "../../../data/Time";
import {SeancePopup} from "../seance-popup";
import {CurrentTimeline} from "../../../data/CurrentTimeline";
import {useEditAvailable} from "../../../hooks/useEditAvailable";
import {validateEditAndNotice} from "../../../noticeUtils";

export function SeanceTimes() {
    const isEditAvailable = useEditAvailable();
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
    const {data: seances, currentTimeline, error: seancesError} = useAppSelector(seancesState);
    const {data: halls, error: hallsError} = useAppSelector(hallsState);
    useEffect(() => {
        dispatch(setCurrentTimeline(new CurrentTimeline().fromSeances(seances).serialize()));
    }, [seances])
    const onAddMovieButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        if (!validateEditAndNotice(isEditAvailable)) {
            return;
        }
        event.preventDefault();
        setCurrentMovie(toMovieData(null));
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
        dispatch(setCurrentTimeline(new CurrentTimeline().fromData(currentTimeline).addChange(data).serialize()));
        setActiveSeancePopup(false);
    }
    const deleteSeanceCallback = (data: SeanceData): void => {
        dispatch(setCurrentTimeline(new CurrentTimeline().fromData(currentTimeline).addDelete(data).serialize()));
        setActiveSeancePopup(false);
    }
    const cancelSeanceCallback = () => {
        setActiveSeancePopup(false);
    }
    const onMovieClick = (movie: Movie): void => {
        if (!validateEditAndNotice(isEditAvailable)) {
            return;
        }
        setCurrentMovie(toMovieData(movie));
        setActiveMoviePopup(true);
    }
    const onSeanceClick = (seance: SeanceData): void => {
        if (!validateEditAndNotice(isEditAvailable)) {
            return;
        }
        setCurrentSeance(seance);
        setActiveSeancePopup(true);
    }
    const onNewSeanceClick = (): void => {
        if (!validateEditAndNotice(isEditAvailable)) {
            return;
        }
        setCurrentSeance(toSeanceData(null));
        setActiveSeancePopup(true);
    }
    const onSaveClick = ():void => {
        dispatch(saveCurrentTimeline(currentTimeline))
    }
    const onCancelClick = ():void => {
        dispatch(setCurrentTimeline(new CurrentTimeline().fromSeances(seances).serialize()));
    }

    const [colorsMap, setColorsMap] = useState({} as ColorsMap)
    useEffect(() => {
        const colorsMap = {} as ColorsMap;
        movies.forEach(m => {
            const movieDiv = document.getElementById("Movie-" + m.id);
            const color = window.getComputedStyle(movieDiv as HTMLElement, null)
                .getPropertyValue("background-color") as string;
            colorsMap[String(m.id)] = color;
        })
        setColorsMap(colorsMap);
    }, [movies, currentTimeline])

    const isButtonsEnabled = new CurrentTimeline().fromData(currentTimeline).hasChanges();

    return (
        <>
            <p className={styles["conf-step__paragraph"]}>
                <button className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]}
                    onClick={onAddMovieButtonClick}>Добавить фильм</button>
            </p>
            <div className={styles["conf-step__movies"]}>
                {movies.map(m => (
                    <div id={"Movie-" + m.id} key={m.id} data-id={m.id} className={styles["conf-step__movie"]}
                         onClick={() => onMovieClick(m)} >
                        <img className={styles["conf-step__movie-poster"]} alt="poster" src={moviePoster}></img>
                        <h3 className={styles["conf-step__movie-title"]}>{m.name}</h3>
                        <p className={styles["conf-step__movie-duration"]}>{m.duration} минут</p>
                    </div>
                ))}
            </div>
            {halls.map(h => {
                return (
                    <div key={h.id} className={styles["conf-step__seances"]}>
                        <div className={styles["conf-step__seances-hall"]}>
                            <h3 className={styles["conf-step__seances-title"]}>{h.name}</h3>
                            <div className={styles["conf-step__seances-timeline"]}
                                onClick={(event: MouseEvent<HTMLDivElement>) => {
                                        event.preventDefault();
                                        onNewSeanceClick();
                                    }
                            }>
                                {new CurrentTimeline().fromData(currentTimeline).getActualSeances()
                                    .filter(s => s.hall.id === h.id)
                                    .sort((s1,s2) => new Time().fillFromTimeData(s1.start)
                                        .compare(new Time().fillFromTimeData(s2.start)))
                                    .map(s => {
                                        return (
                                            <div key={formatTime(s.start)}
                                                 className={styles["conf-step__seances-movie"]}
                                                 onClick={(event: MouseEvent<HTMLDivElement>) => {
                                                     event.preventDefault();
                                                     event.stopPropagation();
                                                     onSeanceClick(s)
                                                 }}
                                                 style={{"width": `${minuteToPixels(s.movie.duration)}px`,
                                                     "backgroundColor": `${colorsMap[String(s.movie.id)]}`,
                                                     "left": `${minuteToPixels(new Time().fillFromTimeData(s.start).toMinutes())}px`}}>
                                                <p className={styles["conf-step__seances-movie-title"]}>{s.movie.name}</p>
                                                <p className={styles["conf-step__seances-movie-start"]}>{formatTime(s.start)}</p>
                                            </div>
                                        )
                                    })}
                            </div>
                        </div>
                    </div>
                )
            })}
            <fieldset className={styles["conf-step__buttons"] + " " + styles["text-center"]}>
                <button className={styles["conf-step__button"] + " " + styles["conf-step__button-regular"]}
                        disabled={!isButtonsEnabled}
                        onClick={onCancelClick}>Отмена</button>
                <input type="submit" value="Сохранить" className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]}
                       disabled={!isButtonsEnabled}
                       onClick={onSaveClick}></input>
            </fieldset>
            {isActiveSeancePopup
                ? (<SeancePopup data={currentSeance} isActive={isActiveSeancePopup}
                               saveCallback={saveSeanceCallback} cancelCallback={cancelSeanceCallback}
                               deleteCallback={deleteSeanceCallback}></SeancePopup>)
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

type ColorsMap = {
    [key: string]: string
}
