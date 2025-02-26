import {useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import {User} from "../types";
import {useAppDispatch} from "./hooks";

export const useAuth = () => {
    const { user, setUser } = useContext(AuthContext);

    const login = (user: User) => {
        setUser(user)
    };

    const logout = () => {
        setUser(null)
    };

    return { user, login, logout};
};