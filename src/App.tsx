import { BrowserRouter } from "react-router-dom"
import Router from "./routers/Router"
import DarkModeSwitch from "./components/DarkModeSwitch"
import HeaderBar from "./components/HeaderBar";

function App() {
    DarkModeSwitch();

    return (
      <BrowserRouter>
        <HeaderBar />
        <Router />
      </BrowserRouter>
    )
}

export default App
