import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../components/Input"
import { emailRegex, mobileRegex, showToastMessage } from "../utils"


const Signup = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ name: "", phone: "", email: "", age: "", password: "", username: "", gender: "", services: "", terms: false })

  const handleChange = (e) => {
    if(e.target.name === 'terms'){
      setUser(curr => ({ ...curr, [e.target.name]: e.target.checked }))
      return
    }
    if (e.target.name !== "age") {
      setUser(curr => ({ ...curr, [e.target.name]: e.target.value }))
      return
    }

    if (e.target.name === "age" && ((parseInt(e.target.value) > 0 && parseInt(e.target.value) <= 100) || e.target.value === "")) {
      setUser(curr => ({ ...curr, [e.target.name]: parseInt(e.target.value) }))
    }
  }

  const disableSubmitButton = () => {
    return (!user.name || !user.phone || !mobileRegex.test(user.phone) || !user.email || !emailRegex.test(user.email) || !user.password || user.password.length < 6 || !user.username || user.username.length < 3 || !user.gender || !user.age || !user.terms)
  }

  const handleSignup = async () => {
    // TODO: implement this function
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/patient/signup`, user)
      if (data.success) {
        showToastMessage('SUCCESS', data.message)
        setUser({ name: "", phone: "", email: "", age: "", password: "", username: "", gender: "", services: "", terms: false })
        // TODO: store other user information in session if time permits
        sessionStorage.setItem('authToken', data.token)
        navigate('/')
      } else {
        showToastMessage('ERROR', data.message)
      }
    } catch (error) {
      console.log(error)
      showToastMessage('ERROR', error.response.data.message)
      if (error.response.status === 401) {
        sessionStorage.removeItem('authToken')
        navigate('/login')
      }
    }
  }

  return (
    <main className="flex w-screen h-screen items-center text-charcoalGray  justify-center">
      <div className="flex flex-wrap w-1/2 gap-3 p-5 px-8 border shadow-md rounded-md items-center justify-between">
        <div className="mb-3 w-full text-center"> LOGO</div>

        <Input type="text" label="Full Name" name="name" value={user.name} handleChange={handleChange} className={"w-[45%]"} />
        <Input type="email" label="Email" name="email" value={user.email} handleChange={handleChange} className={"w-[45%]"} />
        <Input type="text" label="Mobile No." name="phone" value={user.phone} handleChange={handleChange} className={"w-[45%]"} />
        <Input type="number" label="Age" name="age" value={user.age} handleChange={handleChange} className={"w-[45%]"} />
        <div className={`flex flex-col gap-2 w-[40%]  text-xs `}>
          <p >Gender</p>
          <div className="flex gap-1 w-full justify-between">
            <div className="flex  justify-center items-center gap-2">
              <input type="radio" name="gender" value="male" checked={user.gender === "male"} onChange={handleChange} />
              <label >Male</label>
            </div>
            <div className="flex  justify-center items-center gap-2">
              <input type="radio" name="gender" value="female" checked={user.gender === "female"} onChange={handleChange} />
              <label >Female</label>
            </div>
            <div className="flex  justify-center items-center gap-2">
              <input type="radio" name="gender" value="other" checked={user.gender === "other"} onChange={handleChange} />
              <label >Other</label>
            </div>
          </div>
        </div>
        <Input type="text" label="Service Required" name="services" value={user.services} handleChange={handleChange} className={"w-[45%]"} />
        <Input type="text" label="Username" name="username" value={user.username} handleChange={handleChange} className={"w-[45%]"} />
        <Input type="password" label="Password" name="password" value={user.password} handleChange={handleChange} className={"w-[45%]"} />


        <div className="w-full flex items-center justify-between mt-3">
          <div className="text-xs flex items-center gap-2">
            <input type="checkbox" name="terms" checked={user.terms} onChange={handleChange} />
            <label >I accept terms & condition</label>
          </div>
          <button className=" w-[45%] p-2 bg-softGray rounded-md mt-3 disabled:bg-gray-400 disabled:text-white " disabled={disableSubmitButton()} onClick={handleSignup}>Signup</button>
        </div>

      </div>
    </main>
  )
}

export default Signup