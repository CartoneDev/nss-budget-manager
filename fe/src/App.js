import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import MainScreen from "./pages/MainScreen";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />}/>
                <Route path="/registration" element={<Registration />}/>
                <Route path="/budget" element={<MainScreen />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;