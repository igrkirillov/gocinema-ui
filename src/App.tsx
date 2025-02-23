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

function App() {
    return (
        <Provider store={store}>
            <Routes>
                <Route path="/" element={<Navigate to="/admin"/>}/>
                <Route path="/admin" element={<Admin></Admin>}/>
                <Route path="/client" element={<Client></Client>}>
                    <Route path="" element={<Navigate to="movies"/>}/>
                    <Route path="movies" element={<MovieSelection></MovieSelection>}/>
                    <Route path="seances/:id" element={<Booking></Booking>}/>
                </Route>
            </Routes>
        </Provider>
    )
}
export default App