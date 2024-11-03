import { toast } from 'react-toastify';


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
