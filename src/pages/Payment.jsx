import { useLocation } from "react-router-dom"

const Payment = () => {
  const location = useLocation()
  const bookingData = location.state

  
  return (
    <div>Payment</div>
  )
}

export default Payment