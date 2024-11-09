import axios from "axios";
import moment from 'moment';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToastMessage } from "../utils";

const AppointmentModal = ({ show, date, onClose, timeSlots, onDateChange, selectedSlots, setSelectedSlots }) => {
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(date);
  const [services, setServices] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [loading, setLoading] = useState(false);

  const [bookingData, setBookingData] = useState({
    service: {},
    dentist: {},
  });

  const getDentists = async () => {

    if (sessionStorage.getItem("dentists")) {
      setDentists(JSON.parse(sessionStorage.getItem("dentists")))
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/dentists`, {
        headers: {
          'Authorization': `${sessionStorage.getItem('authToken')}`
        }
      });

      if (data.success) {
        setLoading(false)
        sessionStorage.setItem("dentists", JSON.stringify(data.dentists))
        setDentists(data.dentists)
      } else {
        showToastMessage('ERROR', data.message)
      }
    } catch (error) {
      console.log(error)
      if (+error.response.status === 401) {
        sessionStorage.removeItem('authToken')
        navigate('/')
      }
      showToastMessage('ERROR', error.response.data.message)
    }
  }

  const getServices = async () => {
    if (sessionStorage.getItem("services")) {
      setServices(JSON.parse(sessionStorage.getItem("services")))
      return
    }
    setLoading(true)
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/services`, {
        headers: {
          'Authorization': `${sessionStorage.getItem('authToken')}`
        }
      });

      if (data.success) {
        setLoading(false)
        sessionStorage.setItem("services", JSON.stringify(data.services))
        setServices(data.services)
      } else {
        showToastMessage('ERROR', data.message)
      }
    } catch (error) {
      console.error(error)
      if (+error.response.status === 401) {
        sessionStorage.removeItem('authToken')
        navigate('/login')
      }
      showToastMessage('ERROR', error.response.data.message)
    }
  }

  useEffect(() => {
    getDentists()
    getServices()
    // eslint-disable-next-line 
  }, [])

  useEffect(() => {
    setCurrentDate(date);
  }, [date]);


  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: JSON.parse(e.target.value) });
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
    onDateChange(newDate); // Callback to update the parent component with the new date and refresh time slots
  };

  // change the date to previous day using arrow button on header
  const handlePrevDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1)
    // restrict dates which are before today and also restricts bookings for today if time is greater/equal than 5:00 PM
    if (moment(prevDate).isBefore(moment()) || (moment(prevDate).isSame(moment()) && moment().hour() >= 17)) return
    handleDateChange(prevDate);
  };

  // change the date to next day using arrow button on header
  const handleNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    handleDateChange(nextDate);
  };

  // upldates selected slots when time slot is selected or changed, currently supports only one slot selection
  const handleSlotChange = (slot) => {
    const slotEnd = moment(slot, 'hh:mm A').add(60, 'minutes').format('hh:mm A');
    if (selectedSlots.start === slot && selectedSlots.end === slotEnd) {
      setSelectedSlots({ start: '', end: '' });
    } else {
      setSelectedSlots({ start: slot, end: slotEnd });
    }
  };

  // redirect to payment page and closes modal 
  const handleBook = () => {
    navigate('/payment', { state: { selectedSlots, date, ...bookingData } });
    onClose();
  }

  const disablePayment = () => {
    return (!selectedSlots.start || !selectedSlots.end || !bookingData.service || !bookingData.dentist || !date)
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96 ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Book Appointment</h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>
        <div className="mb-2 text-center border-y py-1">

          <div className="flex gap-2 px-14 justify-between  items-center ">
            <button onClick={handlePrevDay} className=" px-1 "> &lt;</button>
            {currentDate?.toDateString()}
            <button onClick={handleNextDay} className=" px-1 " > &gt;</button>
          </div>
        </div>
        <select onChange={handleChange} name="dentist" className="w-full mb-3 p-2 border rounded">
          <option value={""}>Select Dentist</option>
          {dentists?.map((dentist) => (
            <option key={dentist._id} value={JSON.stringify(dentist)}>{dentist.name}</option>
          ))}
        </select>
        <select onChange={handleChange} name="service" className="w-full mb-3 p-2 border rounded">
          <option>Select Service</option>
          {/* Add options */}
          {services?.map((service) => (
            <option key={service._id} value={JSON.stringify(service)}>{service.name}</option>
          ))}
        </select>
        <div className="mb-3  ">
          <p className="font-medium">Select Time Slot </p>
          <div className="flex flex-wrap gap-1 h-28 px-2 justify-between overflow-y-auto">
            {timeSlots.map((slot, index) => (
              <button onClick={() => handleSlotChange(slot)} key={index} className={`py-2 px-1 border rounded-md hover:bg-[#D6CCCC] ${selectedSlots.start === slot ? 'bg-[#D6CCCC]' : ''} `}>{slot} - <span className="text-xs">{moment(slot, 'HH:mm:A').add(60, 'minutes').format('hh:mm A')}</span></button>
            ))}
          </div>
        </div>
        <div className="flex text-sm justify-between">
          <p className=" text-xs  text-center mb-3">Service Rate: &#8377;{bookingData?.service?.price || 0} </p>
          <p className=" text-xs  text-center mb-3">Dentist Rate: &#8377;{bookingData?.dentist?.hourlyRate || 0}/Hour </p>
        </div>
        <p className="font-semibold">Total: &#8377;{(bookingData?.service?.price || 0) + (bookingData?.dentist?.hourlyRate || 0)} <span className="text-xs">Including GST</span></p>
        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button disabled={disablePayment()} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 disabled:bg-gray-500" onClick={handleBook}>Make Payment</button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
