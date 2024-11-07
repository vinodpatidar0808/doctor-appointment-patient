import moment from 'moment';
import { useEffect, useState } from "react";

const AppointmentModal = ({ show, date, onClose, timeSlots, onDateChange, selectedSlots, setSelectedSlots }) => {
  const [currentDate, setCurrentDate] = useState(date);

  useEffect(() => {
    setCurrentDate(date);
  }, [date]);

  if (!show) return null;


  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
    onDateChange(newDate); // Callback to update the parent component with the new date and refresh time slots
  };

  const handlePrevDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    handleDateChange(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    handleDateChange(nextDate);
  };

  const handleSlotChange = (slot) => {
    const slotEnd = moment(slot, 'hh:mm A').add(60, 'minutes').format('hh:mm A');

    if (selectedSlots.start === slot && selectedSlots.end === slotEnd) {
      setSelectedSlots({ start: '', end: '' });
    } else {
      setSelectedSlots({ start: slot, end: slotEnd });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96 ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Book Appointment</h2>
          <button onClick={onClose} className="text-xl">✕</button>
        </div>
        <div className="mb-2 text-center border-y py-1">

          <div className="flex gap-2 px-14 justify-between  items-center ">
            <button
              onClick={handlePrevDay}
              className=" px-1 "
            >
              &lt;
            </button>
            {currentDate?.toDateString()}
            <button
              onClick={handleNextDay}
              className=" px-1 "
            >
              &gt;
            </button>
          </div>
          {/* <p className="font-medium">{date.toDateString()}</p> */}
        </div>
        <select className="w-full mb-3 p-2 border rounded">
          <option>Select Dentist</option>
          {/* Add options */}
        </select>
        <select className="w-full mb-3 p-2 border rounded">
          <option>Select Service</option>
          {/* Add options */}
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
          <p className=" text-xs  text-center mb-3">Service Rate: &#8377;999.00 </p>
          <p className=" text-xs  text-center mb-3">Dentist Rate: &#8377;999.00/Hour </p>
        </div>
        <p className="font-semibold">Total: &#8377;999.00 <span className="text-xs">Including GST</span></p>
        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button disabled className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600 disabled:bg-gray-500">Make Payment</button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
