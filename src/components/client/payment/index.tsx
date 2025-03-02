import styles from "../css/styles.module.scss"
import {useAppDispatch, useAppSelector} from "../../../hooks/storeHooks";
import {buyingState, payTicket} from "../../../slices/buying";
import {MouseEvent, useEffect} from "react";
import {useNavigate} from "react-router";
export function Payment() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {bookedTicket: ticket} = useAppSelector(buyingState);
    useEffect(() => {
        if (!ticket) {
            navigate("/client");
        } else if (ticket.isPayed) {
            navigate(`/client/tickets/${ticket.id}/payed`);
        }
    }, [ticket])
    const onBuyClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        dispatch(payTicket());
    }
    return (
        <section className={styles["ticket"]}>
            <header className={styles["tichet__check"]}>
                <h2 className={styles["ticket__check-title"]}>Вы выбрали билеты:</h2>
            </header>

            <div className={styles["ticket__info-wrapper"]}>
                <p className={styles["ticket__info"]}>На фильм:<span> </span>
                    <span className={styles["ticket__details"] + " " + styles["ticket__title"]}>
                        {ticket?.bookedPlaces[0].movieShow.movie.name}</span>
                </p>
                <p className={styles["ticket__info"]}>Места:<span> </span>
                    <span className={styles["ticket__details"] + " " + styles["ticket__chairs"]}>
                        {ticket?.bookedPlaces.map(p => p.hallPlace.row + "-" + p.hallPlace.col)
                            .reduce((s1, s2) => s1 + ", " + s2)}
                    </span></p>
                <p className={styles["ticket__info"]}>В зале:<span> </span>
                    <span className={styles["ticket__details"] + " " + styles["ticket__hall"]}>
                        {ticket?.bookedPlaces[0].movieShow.hall.name}
                    </span></p>
                <p className={styles["ticket__info"]}>Начало сеанса:<span> </span>
                    <span className={styles["ticket__details"] + " " + styles["ticket__start"]}>
                        {ticket?.bookedPlaces[0].movieShow.start}
                    </span>
                </p>
                <p className={styles["ticket__info"]}>Стоимость:<span> </span>
                    <span className={styles["ticket__details"] + styles["ticket__cost"]}>
                        {" " + ticket?.bookedPlaces[0].movieShow.id}
                    </span> рублей
                </p>

                <button className={styles["acceptin-button"]} onClick={onBuyClick}>Получить код бронирования
                </button>

                <p className={styles["ticket__hint"]}>После оплаты билет будет доступен в этом окне, а также придёт вам на почту.
                    Покажите QR-код нашему контроллёру у входа в зал.</p>
                <p className={styles["ticket__hint"]}>Приятного просмотра!</p>
            </div>
        </section>
    )
}