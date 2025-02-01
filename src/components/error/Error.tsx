export function Error(props: {error: string}) {
    const {error} = props;
    return (
        <div><span><b>Ошибка:</b> {error + ""}</span></div>
    )
}