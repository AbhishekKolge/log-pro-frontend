import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(tz);

const checkTimeIsExpired = (timeArg) => {
  const currentTime = Date.now();
  const time = new Date(timeArg).getTime() - +import.meta.env.VITE_TIME_BUFFER;
  return time < currentTime;
};

const calculateRemainingTime = (timeArg) => {
  const currentTime = Date.now();
  const time = new Date(timeArg).getTime() - +import.meta.env.VITE_TIME_BUFFER;
  const remainingTime = time - currentTime;
  return remainingTime;
};

const formatISTTime = (time) => {
  return dayjs(time).tz('Asia/Calcutta').format('MM/DD/YYYY, h:mm A');
};

export { checkTimeIsExpired, calculateRemainingTime, formatISTTime };
