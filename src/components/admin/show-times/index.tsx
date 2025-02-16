import styles from "../styles.module.scss"
import "../normalize.css"
import React, {Component, forwardRef, MouseEvent, useEffect, useRef, useState} from "react";
import {MoviePopup} from "../movie-popup";
import {Movie, MovieData} from "../../../types";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {fetchMovies, moviesState, saveMovie} from "../../../slices/movies";
import moviePoster from "../../../assets/poster.png"
import {toMovieData} from "../../../data/dataUtils";
import {DndContext, DragMoveEvent, DragOverEvent, DragOverlay, useDraggable, useDroppable} from "@dnd-kit/core";
import {ClientRect, DragStartEvent} from "@dnd-kit/core/dist/types";
import {SortableContext} from "@dnd-kit/sortable";

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
    function handleDragStart(event: DragStartEvent) {
        setDraggingMovie(movies.find(m => m.id === Number(event.active.id)) || null);
    }
    function handleDragEnd() {
        setDraggingMovie(null);
    }
    function handleDragMove(event: DragMoveEvent) {
        updateTimle(timelineRef.current as HTMLDivElement, markerRef.current as HTMLDivElement, event);
    }
    const [draggingMovie, setDraggingMovie] = useState(null as Movie | null);
    const timelineRef = React.createRef<HTMLDivElement>();
    const markerRef = React.createRef<HTMLDivElement>();
    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragMove={handleDragMove}>
            <DragOverlay>
                {draggingMovie ?
                (<TimelineItem movie={draggingMovie}></TimelineItem>) : null}
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
            <Droppable id="show-timeline" >
                <div className={styles["conf-step__seances"]}>
                    <div className={styles["conf-step__seances-hall"]}>
                        <h3 className={styles["conf-step__seances-title"]}>Зал 1</h3>
                        <Timeline ref={timelineRef} markerRef={markerRef}></Timeline>
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
    return (<props.comp ref={setNodeRef} {...listeners} {...attributes} {...props}/>);
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

type TimelineItemProps = {
    movie: Movie,
    onMovieClick: (movie: Movie) => void
} & any

const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>((props: TimelineItemProps, ref) => {
    const {movie: m} = props;
    return (
        <div ref={ref} className={styles["conf-step__seances-movie"]}
             style={{"width": "60px", "backgroundColor": "rgb(133, 255, 137)", "left": "0"}}>
            <p className={styles["conf-step__seances-movie-title"]}>{m.name}</p>
        </div>
    );
});

type TimelineProps = {
    markerRef: React.RefObject<HTMLDivElement>
} & any

const Timeline = forwardRef<HTMLDivElement, TimelineProps>((props: TimelineProps, ref) => {
    return (
        <div ref={ref} className={styles["conf-step__seances-timeline"]}>
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
            <div ref={props.markerRef} className={styles["conf-step__seances-movie"]}
                 style={{"width": "65px", "left": "0px", "display": "none"}}>
                <p className={styles["conf-step__seances-movie-start"]}>00:00</p>
            </div>
        </div>
    )
})

function updateTimle(timeline: HTMLDivElement, marker: HTMLDivElement, event: DragMoveEvent) {
    console.debug(timeline)
    console.debug(event.active.rect.current.translated);
    if (isInnerBounds(timeline.getBoundingClientRect(), event.active.rect.current.translated)) {
        console.log("is inner bounds")
        marker.style = {"width": "65px", "left": "200px", "display": "block"}
    }
}

function isInnerBounds(bounds: DOMRect, rect: ClientRect) {
    return rect.left >= bounds.x && rect.left <= bounds.x + bounds.width
        && rect.top >= bounds.y && rect.top <= bounds.y + bounds.height;
}
