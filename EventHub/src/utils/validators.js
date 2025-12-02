export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

export const validatePassword = (password) => {
  // At least 5 characters, one digit, one lowercase, one special char
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[#@$*]).{5,20}$/;
  return re.test(password);
};

export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
};

export const validateFutureDate = (date) => {
  const selectedDate = new Date(date);
  const now = new Date();
  return selectedDate > now;
};