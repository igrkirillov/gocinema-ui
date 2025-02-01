import './App.css'
import {Provider} from "react-redux";
import {Navigate, Outlet, Route, Routes} from "react-router";
import {store} from "./store";
import {Movies} from "./components/movies/Movies";

function App() {
    return (
        <Provider store={store}>
            <Routes>
                <Route path="/" element={<Layout></Layout>}>
                    <Route path="/" element={<Navigate to="/users"/>}/>
                    <Route path="/users" element={<Movies></Movies>}/>
                </Route>
            </Routes>
        </Provider>
    )
}

export default App

function Layout() {
    return (
        <div className="layout">
            <Outlet></Outlet>
        </div>
    )
}