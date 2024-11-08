import moment from 'moment';
import { toast } from 'react-toastify';

export const cardExpiryRegex = /^(0[1-9]|1[0-2])\/\d{0,2}$/


export const getPageHeader = (pathname) => {
  if (pathname === "/") {
    return "Dashboard"
  }

  if (pathname === "/services") {
    return "Add Services"
  }

  if (pathname === "/reports") {
    return "View Report"
  }

  if (pathname === "/dentist") {
    return "Add Dentist"
  }

}

export const showToastMessage = (type, message) => {
  if (type === 'SUCCESS') {
    toast.success(message, {
      position: 'bottom-center',
      autoClose: 700,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    return
  }

  if (type === 'ERROR') {
    toast.error(message, {
      position: 'bottom-center',
      autoClose: 700,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })
  }
  // Add other types when needed
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const mobileRegex = /^[6-9]\d{9}$/;

export const getMonthName = (monthNumber) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber];
};


export const generateTimeSlots = (date) => {
  const currDate = moment(date).format('YYYYMMDD');
  const today = moment().format('YYYYMMDD');
  const currHour = moment(Date.now()).hour();
  const currMinutes = moment(Date.now()).minutes();
  const slots = [];
  const startHour = currDate === today ? (currMinutes < 30 ? currHour : currHour + 1) : 8; // Start at 8:00 AM
  const endHour = 17; // End at 5:00 PM

  for (let hour = startHour; hour <= endHour; hour++) {
    const slotTime = moment(date).set({ hour, minute: 30 });
    const formattedTime = slotTime.format('hh:mm A');

    slots.push(formattedTime);
    // (currDate === today && currMinutes > 30)
    // if ((currDate !== today && hour !== endHour)) slots.push(formattedTime);

    // Optionally add half-hour slots
    // if (hour !== endHour) {
    //   const halfHourSlot = slotTime.clone().add(30, 'minutes').format('hh:mm A');
    //   slots.push(halfHourSlot);
    // }
  }
  return slots;
};