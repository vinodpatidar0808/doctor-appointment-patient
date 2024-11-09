import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { showToastMessage } from "../utils"

const Login = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ username: "", password: "" })

  const handleChange = (e) => {
    setUser(curr => ({ ...curr, [e.target.name]: e.target.value }))
  }

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/patient/login`,
        user
      )
      if (data.success) {
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        showToastMessage('SUCCESS', data.message)
        navigate('/dashboard')
        return
      }else{
        showToastMessage('ERROR', data.message)
      }

    } catch (error) {
      console.log(error)
      showToastMessage('ERROR', error.response.data.message)
    }
  }


  return (
    <main className="flex w-screen h-screen items-center text-charcoalGray  justify-center">
      <div className="flex flex-col w-1/4 gap-3 p-5 border shadow-md rounded-md items-center">
        <div className="mb-3"> LOGO</div>
        <div className="flex flex-col gap-1 w-full text-xs ">
          <label htmlFor="" >Username</label>
          <input type="text" className="px-2 py-2 outline-none border-2 rounded-[8px] border-softGray " name='username' value={user.username} onChange={handleChange} />
        </div>
        <div className="flex flex-col gap-1 w-full text-xs ">
          <label htmlFor="" >Password</label>
          <input type="password" className="px-2 py-2 outline-none border-2 rounded-[8px] border-softGray " name='password' value={user.password} onChange={handleChange} />
        </div>

        <button className="w-full p-2 bg-softGray rounded-md mt-3 disabled:bg-gray-400 disabled:text-white " disabled={!user.username || !user.password} onClick={handleLogin}>Login</button>

        <div className="flex justify-between w-full"
        >
          <p className="text-xs underline ">Forgot Password</p>
          <Link to="/signup" className="text-xs underline  ">Sign up</Link>
        </div>
      </div>
    </main>
  )
}



export default Login