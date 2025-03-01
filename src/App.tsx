// import './App.css'
import {Navigate, Route, Routes} from "react-router";
import {Admin} from "./pages/admin";
import {Client} from "./pages/client";
import {MovieSelection} from "./components/client/movieSelection";
import {Booking} from "./components/client/booking";
import {AuthContext} from "./context/AuthContext";
import Login from "./pages/login/login";
import {User} from "./types";
import {useAppDispatch, useAppSelector} from "./hooks/storeHooks";
import {clearUser, currentUser, loginUser} from "./slices/auth";
import {Payment} from "./components/client/payment";
import {Main} from "./components/client/main";
import {Buying} from "./components/client/buying";
import {Payed} from "./components/client/payed";

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
                <Route path="/" element={<Navigate to="/client"/>}/>
                <Route path="/login" element={<Login></Login>}/>
                <Route path="/admin" element={<Admin></Admin>}/>
                <Route path="/client" element={<Client></Client>}>
                    <Route path="" element={<Navigate to="movies"/>}/>
                    <Route path="movies" element={<MovieSelection></MovieSelection>}/>
                    <Route path="seances/:id" element={<Main><Buying></Buying></Main>}/>
                    <Route path="tickets/:id" element={<Main><Payment></Payment></Main>}/>
                    <Route path="tickets/:id/payed" element={<Main><Payed></Payed></Main>}/>
                </Route>
            </Routes>
        </AuthContext.Provider>
    )
}
export default App