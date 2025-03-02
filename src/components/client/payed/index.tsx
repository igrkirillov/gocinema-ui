import styles from "../css/styles.module.scss"
import {useAppSelector} from "../../../hooks/storeHooks";
import {buyingState} from "../../../slices/buying";
import {useEffect} from "react";
import {useNavigate} from "react-router";
import {QRCodeSVG} from 'qrcode.react';
import {dateISOStrToRuFormat} from "../../../data/dataUtils";

export function Payed() {
    const navigate = useNavigate();
    const {bookedTicket: ticket} = useAppSelector(buyingState);
    useEffect(() => {
        if (!ticket) {
            navigate("/client");
        } else if (!ticket.isPayed) {
            navigate(`/client/tickets/${ticket.id}`);
        }
    }, [ticket])
    return (
        <section className={styles["ticket"]}>
            <header className={styles["tichet__check"]}>
                <h2 className={styles["ticket__check-title"]}>Электронный билет</h2>
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
                <p className={styles["ticket__info"]}>Дата сеанса:<span> </span>
                    <span className={styles["ticket__details"] + " " + styles["ticket__start"]}>
                            {dateISOStrToRuFormat(ticket?.bookedPlaces[0].seanceDate as string)}
                        </span>
                </p>
                {/*параметр size принимается только в px, хотя по факту в rem тоже работает*/}
                <QRCodeSVG className={styles["qr"]} size="20rem" value={ticket?.qrCode as string}/>
                    <p className={styles["ticket__hint"]}>Покажите QR-код нашему контроллеру для подтверждения бронирования.</p>
                    <p className={styles["ticket__hint"]}>Приятного просмотра!</p>
            </div>
        </section>
    )
}