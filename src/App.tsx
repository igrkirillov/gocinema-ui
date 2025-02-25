// import './App.css'
import {Provider} from "react-redux";
import {Navigate, Route, Routes} from "react-router";
import {store} from "./store";
import {Admin} from "./pages/admin";
import {Client} from "./pages/client";
import {MovieSelection} from "./components/client/movieSelection";
import {Booking} from "./components/client/booking";
import {AuthContext} from "./context/AuthContext";
import Login from "./pages/login/login";
import {useEffect, useState} from "react";
import {User} from "./types";
import {useAppSelector} from "./hooks/hooks";
import {currentUser} from "./slices/auth";
import config from "./../config/app.json"

function App() {
    const [user, setUser] = useState<User>(useAppSelector(currentUser) as User);
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