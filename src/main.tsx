import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import "./components/admin/css/styles.module.scss"
import App from './App.tsx'
import {BrowserRouter} from "react-router";
import {store} from "./store";
import {Provider} from "react-redux";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Provider store={store}>
            <App />
          </Provider>
      </BrowserRouter>
  </StrictMode>,
)
