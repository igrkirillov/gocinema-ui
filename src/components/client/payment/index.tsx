export function Payment() {
    return (
        <section className="ticket">

            <header className="tichet__check">
                <h2 className="ticket__check-title">Вы выбрали билеты:</h2>
            </header>

            <div className="ticket__info-wrapper">
                <p className="ticket__info">На фильм: <span className="ticket__details ticket__title">Звёздные войны XXIII: Атака клонированных клонов</span>
                </p>
                <p className="ticket__info">Места: <span className="ticket__details ticket__chairs">6, 7</span></p>
                <p className="ticket__info">В зале: <span className="ticket__details ticket__hall">1</span></p>
                <p className="ticket__info">Начало сеанса: <span className="ticket__details ticket__start">18:30</span>
                </p>
                <p className="ticket__info">Стоимость: <span className="ticket__details ticket__cost">600</span> рублей
                </p>

                <button className="acceptin-button" onClick="location.href='ticket.html'">Получить код бронирования
                </button>

                <p className="ticket__hint">После оплаты билет будет доступен в этом окне, а также придёт вам на почту.
                    Покажите QR-код нашему контроллёру у входа в зал.</p>
                <p className="ticket__hint">Приятного просмотра!</p>
            </div>
        </section>
    )
}