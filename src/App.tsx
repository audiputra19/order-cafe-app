import { BrowserRouter } from "react-router-dom"
import Router from "./routers/Router"
import DarkModeSwitch from "./components/DarkModeSwitch"

function App() {
    DarkModeSwitch();

    return (
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    )
}

export default App
