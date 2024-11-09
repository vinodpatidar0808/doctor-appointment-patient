
import axios from "axios"
import moment from 'moment'
import { useEffect, useState } from "react"
import { Calendar, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useNavigate } from "react-router-dom"
import AppointmentModal from "../components/AppointmentModal"
import CalendarToolbar from "../components/CalenderToolbar"
import { generateTimeSlots, showToastMessage } from "../utils"

const localizer = momentLocalizer(moment) // or globalizeLocalizer


const Dashboard = () => {
  const navigate = useNavigate();
  const [calenderView, setCalenderView] = useState("month")
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState({ start: "", end: "" });

  const [events, setEvents] = useState([
    {
      title: "Meeting ",
      start: new Date(2024, 10, 6, 9, 0), // November 6, 2024, 9:00 AM
      end: new Date(2024, 10, 6, 12, 0),  // November 6, 2024, 12:00 PM
    },
    {
      title: "Lunch Break",
      start: new Date(2024, 10, 6, 12, 30), // November 6, 2024, 12:30 PM
      end: new Date(2024, 10, 6, 13, 30),   // November 6, 2024, 1:30 PM
    },
  ]);

  const getAppointments = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/patient/appointments/${user._id}`, {
        headers: {
          'Authorization': `${sessionStorage.getItem('authToken')}`
        }
      })
      if (data.success) {
        setEvents(data.appointments.map((appointment) => {
          const [day, month, year] = appointment.startDate.split('/');
          const [startHour, startMinutes] = moment(appointment.startTime, 'hh:mm A').format('HH:mm').split(':');
          const [endHour, endMinutes] = moment(appointment.endTime, 'hh:mm A').format('HH:mm').split(':');
          return {
            amount: appointment.amount,
            title: appointment.title,
            start: new Date(year, month - 1, day, startHour, startMinutes),
            end: new Date(year, month - 1, day, endHour, endMinutes),
          }
        }))
      } else {
        showToastMessage('ERROR', data.message)
      }
    } catch (error) {
      console.log(error)
      if (+error.response?.status === 401) {
        sessionStorage.removeItem('authToken')
        navigate('/')
        return
      }
      showToastMessage('ERROR', error.response.data.message)
    }
  }

  useEffect(() => {
    getAppointments();
    //eslint-disable-next-line
  }, [])

  const handleSelectSlot = (slotInfo) => {
    const { start, end, slots } = slotInfo;
    const action = slotInfo.action;
    if (action === "select" && start.toDateString() !== end.toDateString()) {
      showToastMessage("ERROR", "Please select same day slots")
      return
    }
    if (action === "select" && slots?.length > 2) {
      showToastMessage("ERROR", "You can not book an Appointment for more than 1 hour!")
      return
    }

    setTimeSlots(generateTimeSlots(start))
    const day = moment(start).day();
    const today = moment().format('YYYYMMDD');
    const currDate = moment(start).format('YYYYMMDD');
    const currHour = moment(Date.now()).hour();
    const currMinutes = moment(Date.now()).minutes();

    // return 

    // Allow only Monday to Friday and between 8:30 AM and 5:30 PM
    const timeCondition = currDate === today ? (currHour < 17 || (currHour === 17 && currMinutes <= 30)) : currDate < today ? false : true

    // ((startHour > 8) || (startHour === 8 && startMinute >= 30))  && // After 8:30 AM
    // (startHour < 17 || (startHour === 17 && startMinute <= 30))
    // TODO: check slots for same day 
    if (
      day >= 1 && day <= 5 && // Monday to Friday
      timeCondition
    ) {
      setSelectedDate(start);
      setShowModal(true);
      if (action === "select") {
        setSelectedSlots({ start: moment(slots[0]).format('hh:mm A'), end: moment(slots[slots.length - 1]).format('hh:mm A') });
      }
    } else {
      showToastMessage("ERROR", 'Appointments can only be scheduled between Monday to Friday from 8:30 AM to 5:30 PM.');
    }
  }

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setSelectedSlots([]);
    setTimeSlots(generateTimeSlots(newDate))
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
    setSelectedSlots([]);
    setTimeSlots([]);
    setShowModal(false);
  };

  return (
    <div className="h-[500px] flex flex-col px-8">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onView={() => setCalenderView('week')}
        view={calenderView}
        defaultView="month"
        selectable
        onSelectSlot={handleSelectSlot}
        step={60}
        timeslots={1}
        min={new Date(1970, 1, 1, 8, 30)} // Set the minimum time to 8:30 AM, in week view calender
        max={new Date(1970, 1, 1, 17, 30)} // Set the maximum time to 5:30 PM, in week view calender
        dayPropGetter={(date) => {
          const currDate = moment(date).format('YYYYMMDD');
          const today = moment().format('YYYYMMDD');
          const currHour = moment(Date.now()).hour();
          const day = date.getDay();
          // Disable weekends and past dates
          if (day === 0 || day === 6 || currDate < today || (currDate === today && currHour > 17)) {
            return {
              className: 'bg-gray-100 pointer-events-none',
              style: { pointerEvents: 'none' }, // Disable weekends
            };
          }
        }}
        showAllEvents={true}
        components={{
          event: ({ event }) => <div className="flex text-xs items-end" onClick={() => setCalenderView('week')}>{event.title}</div>,
          toolbar: CalendarToolbar
        }}
      />
      <AppointmentModal show={showModal} timeSlots={timeSlots} selectedSlots={selectedSlots} setSelectedSlots={setSelectedSlots} onDateChange={handleDateChange} date={selectedDate} onClose={handleCloseModal} />
    </div>
  )
}

export default Dashboard
