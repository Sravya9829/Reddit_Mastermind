import { format, addHours, addDays } from 'date-fns';

export const formatTimestamp = (date) => {
  return format(date, 'yyyy-MM-dd HH:mm');
};

export const randomFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const calculateHoursDifference = (date1, date2) => {
  return Math.abs(date2 - date1) / (1000 * 60 * 60);
};

export const generateUUID = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
