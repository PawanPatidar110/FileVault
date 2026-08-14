import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SharedFile from "./pages/SharedFile";
import Files from "./pages/Files";
import Shared from "./pages/Shared";
import Starred from "./pages/Starred";
import Settings from "./pages/Setting";


function App() {
    return (
        <ThemeProvider>
        <BrowserRouter>
            <Routes>

                {/* Public routes */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/share/:shareToken"
                    element={<SharedFile />}
                />

                {/* Protected routes */}

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/files"
                        element={<Files />}
                    />

                    <Route
                        path="/shared"
                        element={<Shared />}
                    />

                    <Route
                        path="/starred"
                        element={<Starred />}
                    />

                    <Route
                        path="/settings"
                        element={<Settings />}
                    />

                </Route>

                {/* Fallback */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>

        </ThemeProvider>
    );
}

export default App;