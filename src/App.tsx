// import './App.css'
import {Provider} from "react-redux";
import {Navigate, Outlet, Route, Routes} from "react-router";
import {store} from "./store";
import {Admin} from "./components/admin";
import {Days} from "./components/client/days";
import {Main} from "./components/client/main";
import {Header} from "./components/client/header";
import {Client} from "./components/client";
import {MovieSelection} from "./components/client/movieSelection";
import {Booking} from "./components/client/booking";
import {AuthContext} from "./context/AuthContext";
import {useAuth} from "./hooks/useAuth";
import Login from "./pages/login/login";
import {useState} from "react";
import {User} from "./hooks/useUser";

function App() {
    const [user, setUser] = useState<User>(null);
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            <Provider store={store}>
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
            </Provider>
        </AuthContext.Provider>
    )
}
export default App