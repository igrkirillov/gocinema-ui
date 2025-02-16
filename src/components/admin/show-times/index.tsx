import styles from "../styles.module.scss"
import "../normalize.css"
import React, {Component, forwardRef, MouseEvent, useEffect, useState} from "react";
import {MoviePopup} from "../movie-popup";
import {Hall, Movie, MovieData, Seance, SeanceData, TimeData} from "../../../types";
import {useAppDispatch, useAppSelector} from "../../../hooks";
import {fetchMovies, moviesState, saveMovie} from "../../../slices/movies";
import moviePoster from "../../../assets/poster.png"
import {formatTime, toMovieData} from "../../../data/dataUtils";
import {DndContext, DragEndEvent, DragMoveEvent, DragOverlay, useDraggable, useDroppable} from "@dnd-kit/core";
import {ClientRect, DragStartEvent} from "@dnd-kit/core/dist/types";
import {Rect} from "@dnd-kit/core/dist/utilities";
import {DEFAULT_DURATION, MINUTE_TO_PX} from "../../../constants";
import {fetchSeances, saveSeance, seancesState} from "../../../slices/seances";
import {hallsState} from "../../../slices/halls";
import {Time} from "../../../data/Time";

export function ShowTimes() {
    const [isActiveMoviePopup, setActiveMoviePopup] = useState(false);
    const [currentMovie, setCurrentMovie] = useState({} as MovieData);
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
        setDraggingColor(window.getComputedStyle(document.getElementById(String(event.active.id)) as HTMLElement,
            null).getPropertyValue("background-color"))
    }
    function handleDragEnd(event: DragEndEvent) {
        const timeData = toTimeData(markerProps.bounds, markerProps.rect);
        const movie = draggingMovie;
        // @ts-ignore
        console.debug(event.over)
        const hall = halls.find(h => h.id === event.over?.data?.current["hallId"]) as Hall;
        console.debug(timeData)
        console.debug(movie)
        console.debug(hall)
        if (hall && movie && timeData) {
            dispatch(saveSeance(createSeanceData(hall, movie, timeData)))
        }
        setDraggingMovie(null);
        setDraggingColor(null);
        setMarkerProps({} as MarkerProps);
    }
    function handleDragMove(event: DragMoveEvent) {
        const bounds = timelineRef.current?.getBoundingClientRect() as DOMRect;
        const draggableRect = event.active.rect.current.translated as Rect;
        const markerVisible = isInnerBounds(bounds, draggableRect);
        setMarkerProps({visible: markerVisible, bounds: bounds, rect: draggableRect});
    }
    const [draggingMovie, setDraggingMovie] = useState(null as Movie | null);
    const [draggingColor, setDraggingColor] = useState(null as string | null);
    const timelineRef = React.createRef<HTMLDivElement>();
    const [markerProps, setMarkerProps] = useState<MarkerProps>({} as MarkerProps);
    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragMove={handleDragMove}>
            <DragOverlay>
                {draggingMovie ?
                (<TimelineItem movie={draggingMovie} color={draggingColor}></TimelineItem>) : null}
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
            {halls.map(h => {
                return (
                    <Droppable id={h.id} hall={h}>
                        <div className={styles["conf-step__seances"]}>
                            <div className={styles["conf-step__seances-hall"]}>
                                <h3 className={styles["conf-step__seances-title"]}>{h.name}</h3>
                                <Timeline ref={timelineRef} markerProps={markerProps} hall={h}
                                    seances={seances.filter(s => s.hall.id === h.id)}></Timeline>
                            </div>
                        </div>
                    </Droppable>
                )
            })}
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

export function Droppable(props: {id: string, hall: Hall} & any) {
    const {isOver, setNodeRef} = useDroppable({
        id: props.id,
        data: {
            hallId: props.hall.id
        }
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
    color: string
} & any

const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>((props: TimelineItemProps, ref) => {
    const {movie: m, color} = props;
    return (
        <div ref={ref} className={styles["conf-step__seances-movie"]}
             style={{"width": `${m.duration ? minuteToPixels(m.duration) : DEFAULT_DURATION}px`, "backgroundColor": `${color}`, "left": "0"}}>
            <p className={styles["conf-step__seances-movie-title"]}>{m.name}</p>
        </div>
    );
});

type TimelineProps = {
    markerProps: MarkerProps,
    hall: Hall,
    seances: Seance[]
} & any

const Timeline = forwardRef<HTMLDivElement, TimelineProps>((props: TimelineProps, ref) => {
    return (
        <div ref={ref} className={styles["conf-step__seances-timeline"]}>
            {props.seances
                .sort((s1,s2) => new Time().fillFromString(s1.start)
                    .compare(new Time().fillFromString(s2.start)))
                .map(s => {
                    return (
                        <div className={styles["conf-step__seances-movie"]}
                             style={{"width": `${minuteToPixels(s.movie.duration)}px`,
                                 "backgroundColor": "rgb(133, 255, 137)",
                                 "left": `${minuteToPixels(new Time().fillFromString(s.start).toMinutes())}px`}}>
                            <p className={styles["conf-step__seances-movie-title"]}>{s.movie.name}</p>
                            <p className={styles["conf-step__seances-movie-start"]}>{s.start}</p>
                        </div>
                    )
                })}
            {props.markerProps.visible ? (<Marker {...props.markerProps}></Marker>) : null}
        </div>
    )
})

type MarkerProps = {
    visible: boolean,
    bounds: DOMRect,
    rect: Rect
}
function Marker(props: MarkerProps) {
    const time = toTimeData(props.bounds, props.rect);
    const left = props.rect.left - props.bounds.x + 1; // 1px бордюр
    return (
        <div className={styles["conf-step__seances-movie"] + " " + styles["marker"]} style={{"left": `${left}px`, "display": "block"}}>
            <p className={styles["conf-step__seances-movie-start"]}>{formatTime(time)}</p>
        </div>
    )
}

function isInnerBounds(bounds: DOMRect, rect: ClientRect) {
    return !!bounds && !!rect
        && rect.left >= bounds.x && rect.left <= bounds.x + bounds.width
        && rect.top >= bounds.y && rect.top <= bounds.y + bounds.height;
}

function minuteToPixels(mm: number): number {
    return +Number(mm * MINUTE_TO_PX).toFixed(0);
}

function toTimeData(bounds: DOMRect, rect: ClientRect): TimeData {
    const allMm = (rect.left - bounds.x)  / MINUTE_TO_PX;
    const hours = Math.floor(allMm / 60);
    const minutes = Math.floor(allMm - hours * 60);
    return {hours, minutes} as TimeData;
}

function createSeanceData(hall: Hall, movie: Movie, timeData: TimeData): SeanceData {
    return {
        hall: hall,
        movie: movie,
        start: timeData
    } as SeanceData;
}
