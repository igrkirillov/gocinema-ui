import {useAppDispatch, useAppSelector} from "../../hooks";
import {Spinner} from "../spinner/Spinner";
import {Error} from "../error/Error";
import {useEffect} from "react";
import {fetchUsers, usersState} from "../../slices/users";

export function Movies() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchUsers())
    }, []) //mounted
    const {loading, users, error} = useAppSelector(usersState);
    return loading
        ? (<Spinner/>)
        : (error ? (<Error error={error}/>) : (<span>{JSON.stringify(users)}</span>))
}

