import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import MainLayout from "./components/MainLayout"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Payment from "./pages/Payment"
import PaymentSuccess from "./pages/PaymentSuccess"


function App() {



  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={<MainLayout />}>
          <Route index path="/dashboard" element={<Dashboard />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>

  )
}

export default App
