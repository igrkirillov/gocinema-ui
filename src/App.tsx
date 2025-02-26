// import './App.css'
import {Navigate, Route, Routes} from "react-router";
import {Admin} from "./pages/admin";
import {Client} from "./pages/client";
import {MovieSelection} from "./components/client/movieSelection";
import {Booking} from "./components/client/booking";
import {AuthContext} from "./context/AuthContext";
import Login from "./pages/login/login";
import {User} from "./types";
import {useAppDispatch, useAppSelector} from "./hooks/hooks";
import {clearUser, currentUser, loginUser} from "./slices/auth";

function App() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(currentUser) as User;
    const setUser = (user: User | null) => {
        if (user) {
            dispatch(loginUser(user));
        } else {
            dispatch(clearUser())
        }
    }
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            <Routes>
                <Route path="/" element={<Navigate to="/admin"/>}/>
                <Route path="/login" element={<Login></Login>}/>
                <Route path="/admin" element={<Admin></Admin>}/>
                <Route path="/client" element={<Client></Client>}>
                    <Route path="" element={<Navigate to="movies"/>}/>
                    <Route path="movies" element={<MovieSelection></MovieSelection>}/>
                    <Route path="seances/:id" element={<Booking></Booking>}/>
                </Route>
            </Routes>
        </AuthContext.Provider>
    )
}
export default App