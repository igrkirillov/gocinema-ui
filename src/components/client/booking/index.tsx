import {useParams} from "react-router";

export function Booking() {
    const seanceId = useParams()["id"] as string;
    return (
        <>
            <p>seanceId {seanceId}</p>
        </>
    )
}