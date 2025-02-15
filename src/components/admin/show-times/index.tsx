import styles from "../styles.module.scss"
import "../normalize.css"
import {Component, forwardRef, MouseEvent, useEffect, useState} from "react";
import {MoviePopup} from "../movie-popup";
import {Movie, MovieData} from "../../../types";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {fetchMovies, moviesState, saveMovie} from "../../../slices/movies";
import moviePoster from "../../../assets/poster.png"
import {toMovieData} from "../../../data/dataUtils";
import {DndContext, DragOverlay, useDraggable, useDroppable} from "@dnd-kit/core";

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
    const onMovieClick = (movie: Movie): void => {
        setCurrentMovie(toMovieData(movie));
        setActiveMoviePopup(true);
    }
    function handleDragStart() {
        setIsDragging(true);
    }
    function handleDragEnd() {
        setIsDragging(false);
    }
    const [isDragging, setIsDragging] = useState(false);
    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <DragOverlay>
                {isDragging ?
                (<div>
                    <img className={styles["conf-step__movie-poster"]} alt="poster" src={moviePoster}></img>
                    <h3 className={styles["conf-step__movie-title"]}>34r34r</h3>
                    <p className={styles["conf-step__movie-duration"]}>43r34r43r43r минут</p>
                </div>) : null}
            </DragOverlay>
            <p className={styles["conf-step__paragraph"]}>
                <button className={styles["conf-step__button"] + " " + styles["conf-step__button-accent"]}
                    onClick={onAddButtonClick}>Добавить фильм</button>
            </p>
                <div className={styles["conf-step__movies"]}>
                    {movies.map(m => {
                        const DraggableMovie = forwardRef((props: MovieCompProps, ref) => {
                            return (<Draggable comp = {MovieComponent} ref={ref} {...props} id={m.id}></Draggable>);
                        });
                        return (<DraggableMovie onMovieClick={onMovieClick} movie = {m}></DraggableMovie>)
                    })}
                </div>
            <Droppable id="show-timeline">
                <div className={styles["conf-step__seances"]}>
                    <div className={styles["conf-step__seances-hall"]}>
                        <h3 className={styles["conf-step__seances-title"]}>Зал 1</h3>
                        <div className={styles["conf-step__seances-timeline"]}>
                            <div className={styles["conf-step__seances-movie"]}
                                 style={{"width": "60px", "backgroundColor": "rgb(133, 255, 137)", "left": "0"}}>
                                <p className={styles["conf-step__seances-movie-title"]}>Миссия выполнима</p>
                                <p className={styles["conf-step__seances-movie-start"]}>00:00</p>
                            </div>
                            <div className={styles["conf-step__seances-movie"]}
                                 style={{"width": "60px", "backgroundColor": "rgb(133, 255, 137)", "left": "360px"}}>
                                <p className={styles["conf-step__seances-movie-title"]}>Миссия выполнима</p>
                                <p className={styles["conf-step__seances-movie-start"]}>12:00</p>
                            </div>
                            <div className={styles["conf-step__seances-movie"]}
                                 style={{"width": "65px", "backgroundColor": "rgb(202, 255, 133)", "left": "420px"}}>
                                <p className={styles["conf-step__seances-movie-title"]}>Звёздные войны XXIII: Атака клонированных клонов</p>
                                <p className={styles["conf-step__seances-movie-start"]}>14:00</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Droppable>
            {isActiveMoviePopup
                ? (<MoviePopup data={currentMovie} isActive={isActiveMoviePopup}
                               saveCallback={saveCallback} cancelCallback={cancelCallback}></MoviePopup>)
                : (<></>)}
        </DndContext>
    )
}

type MovieCompProps = {
    movie: Movie,
    onMovieClick: (movie: Movie) => void
} & any

const MovieComponent = forwardRef(({ movie: m, onMovieClick, ...props }: MovieCompProps, ref) => {
    function onMovieDivClick() {
        onMovieClick(m);
    }
    return (
        <div ref={ref} key={m.id} data-id={m.id} className={styles["conf-step__movie"]}
             onClick={onMovieDivClick} {...props}>
            <img className={styles["conf-step__movie-poster"]} alt="poster" src={moviePoster}></img>
            <h3 className={styles["conf-step__movie-title"]}>{m.name}</h3>
            <p className={styles["conf-step__movie-duration"]}>{m.duration} минут</p>
        </div>
    );
});

type DraggableProps = {
    comp: Component,
    id: string
} & any
export function Draggable(props: DraggableProps) {
    const {attributes, listeners, setNodeRef} = useDraggable({
        id: props.id,
    });

    return (
    <props.comp ref={setNodeRef} {...listeners} {...attributes} {...props}>

    </props.comp>
    );
}

export function Droppable(props: any) {
    const {isOver, setNodeRef} = useDroppable({
        id: props.id,
    });
    const style = {
        opacity: isOver ? 1 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
}