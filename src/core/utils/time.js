import dayjs from 'dayjs';

export const formatDate = (date, format = 'YYYY-MM-DD') => {
  return dayjs(date).format(format);
};

export const getNow = () => {
  return dayjs().toISOString();
};

export const addDays = (days) => {
  return dayjs().add(days, 'day').toISOString();
};
