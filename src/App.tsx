// import './App.css'
import {Provider} from "react-redux";
import {Navigate, Route, Routes} from "react-router";
import {store} from "./store";
import {Admin} from "./components/admin";
import {Client} from "./components/client";

function App() {
    return (
        <Provider store={store}>
            <Routes>
                <Route path="/" element={<Navigate to="/admin"/>}/>
                <Route path="/admin" element={<Admin></Admin>}/>
                <Route path="/client" element={<Client></Client>}/>
            </Routes>
        </Provider>
    )
}

export default App