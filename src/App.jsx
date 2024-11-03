import { BrowserRouter, Route, Routes } from "react-router-dom"
import './App.css'
import MainLayout from "./components/MainLayout"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Signup from "./pages/Signup"


function App() {



  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={<MainLayout />}>
          {/* Nested routes */}
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>

  )
}

export default App
