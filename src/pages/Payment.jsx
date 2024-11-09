import axios from "axios"
import moment from 'moment'
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Input from "../components/Input"
import { showToastMessage } from "../utils"

const Payment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const bookingData = location.state
  const [paymentData, setPaymentData] = useState({ cardNumber: '', cardHolderName: "", cardExpiry: "", cardCvv: "" })
  const [showCvv, setShowCvv] = useState(false)

  const createBooking = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    const payload = {
      title: `${bookingData.service.name} with ${bookingData.dentist.name}`,
      dentistName: bookingData.dentist.name,
      serviceName: bookingData.service.name,
      amount: bookingData.service.price + bookingData.dentist.hourlyRate,
      dentistId: bookingData.dentist._id,
      serviceId: bookingData.service._id,
      startTime: bookingData.selectedSlots.start,
      endTime: bookingData.selectedSlots.end,
      startDate: payload.endDate = moment(bookingData.date).format('DD/MM/YYYY'),
      userId: user._id,
      userName: user.name,
    }

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/patient/createappointment`, { ...payload }, {
        headers: {
          'Authorization': `${sessionStorage.getItem('authToken')}`
        }
      })
      if (data.success) {
        showToastMessage('SUCCESS', data.message)
        navigate('/')
      } else {
        showToastMessage('ERROR', data.message)
      }
    } catch (error) {
      console.log(error)
      showToastMessage('ERROR', error.response.data.message)
    }
  }

  const handleChange = (e) => {
    if (e.target.name === 'cardNumber' && "1234567890 ".includes(e.target.value.charAt(e.target.value.length - 1)) && e.target.value.length < 20) {
      if (e.target.value.length === 4 || e.target.value.length === 9 || e.target.value.length === 14) {
        e.target.value += ' '
      }
      setPaymentData({ ...paymentData, [e.target.name]: e.target.value })
      return
    }

    if (e.target.name === 'cardCvv' && e.target.value.length < 4 && !isNaN(+e.target.value)) {
      setPaymentData({ ...paymentData, [e.target.name]: e.target.value })
      return
    }

    // cardExpiryRegex.test(e.target.value) // see why this is not working
    // todo: fix the / character removal, remove it automatically
    if (e.target.name === 'cardExpiry' && e.target.value.length < 6 && (!isNaN(+e.target.value.charAt(e.target.value.length - 1)) || e.target.value.charAt(2) === '/')) {
      if (e.target.value.length === 2 && paymentData.cardExpiry.charAt(2) !== '/') {
        e.target.value += '/'
      }

      // const valid = cardExpiryRegex.text(e.target.value)

      setPaymentData({ ...paymentData, [e.target.name]: e.target.value })
      return
    }

    if (e.target.name === 'cardHolderName') {
      setPaymentData({ ...paymentData, [e.target.name]: e.target.value.toUpperCase() })
      return
    }

    if (e.target.name === 'saveCard') {
      setPaymentData({ ...paymentData, [e.target.name]: e.target.checked })
    }
  }

  const disablePayBtn = () => {
    return (paymentData?.cardNumber?.length < 19 || !paymentData.cardHolderName || paymentData?.cardExpiry?.length < 5 || paymentData?.cardCvv?.length < 3)
  }

  return (
    <div className="px-8 flex flex-col gap-3 w-1/2">
      <h1>Select Payment Method</h1>
      <div className="flex mt-2">
        <div className="border-b-2  px-5 font-semibold border-charcoalGray ">
          Card
        </div>
        <div className="px-5 font-semibold text-gray-500 ">
          Net Banking
        </div>
        <div className="px-5 font-semibold text-gray-500 ">
          UPI
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4 w-full">
        <Input type={'text'} label={'Card Number'} name={'cardNumber'} value={paymentData.cardNumber} handleChange={handleChange} className={'w-full'} />
        <Input type={'text'} label={'Cardholder Name'} name={'cardHolderName'} value={paymentData.cardHolderName} handleChange={handleChange} className={'w-full'} />

        <div className="flex gap-3">
          <Input type={'text'} label={'Expiration Date'} placeholder={'MM/YY'} name={'cardExpiry'} value={paymentData.cardExpiry} handleChange={handleChange} className={'w-full'} />

          <div className="flex gap-3 w-1/3 relative ">
            <Input type={showCvv ? 'text' : 'password'} label={'CVV'} name={'cardCvv'} value={paymentData.cardCvv} handleChange={handleChange} className={'w-full'} />
            <p className="absolute right-2 top-[26px]" onClick={() => setShowCvv(curr => !curr)}>

              {showCvv ? <svg height={24} width={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-charcoalGray">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
                : <svg height={24} width={24} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-charcoalGray">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>}

            </p>

          </div>

        </div>

        <Input type={'checkbox'} label={'Expiration Date'} name={'saveCard'} value={paymentData.saveCard} handleChange={handleChange} className={'w-1/3 !flex-row-reverse text-charcoalGray !text-md mt-2 '} />
      </div>

      <div className="flex justify-end gap-3 text-charcoalGray">
        <button onClick={() => navigate(-1)} className="">Cancel</button>
        <button onClick={createBooking} disabled={disablePayBtn()} className="bg-softGray rounded-md px-6 py-1">Pay</button>
      </div>

    </div>
  )
}

export default Payment