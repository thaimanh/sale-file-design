import {
  format,
  formatISO9075,
  parse,
  isBefore as fnsIsBefore,
  nextDay as fnsNextDay,
  Day,
  addMinutes,
} from 'date-fns';

const ONE_SEC = 1000;
const ONE_MIN = ONE_SEC * 60;
const ONE_HOUR = ONE_MIN * 60;
const ONE_DATE = ONE_HOUR * 24;

export const isDate = (date: any): boolean => {
  if (typeof date === 'string') {
    return !Number.isNaN(new Date(date).getTime());
  }
  return date instanceof Date && !Number.isNaN(date.getTime());
};

export const isBefore = (date1: any, date2: any): boolean => {
  return (
    isDate(date1) &&
    isDate(date2) &&
    fnsIsBefore(parse(date1, 'yyyy-MM-dd', new Date()), parse(date2, 'yyyy-MM-dd', new Date()))
  );
};

export const nextDate = (date: any): Date | null => {
  return isDate(date) ? new Date(parse(date, 'yyyy-MM-dd', new Date()).getTime() + ONE_DATE) : null;
};

export const nextWeekDay = (date: any, weekDay: Day): Date | null => {
  return isDate(date) ? fnsNextDay(parse(date, 'yyyy-MM-dd', new Date()), weekDay) : null;
};

// date parser for validate shape by lib yup
export const yupParserDateString = (value: any, originalValue: any) => {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, 'yyyy-MM-dd', new Date());

  return parsedDate;
};

// Format date as format db accepted
export const dateToDbStr = (date: Date | number) => {
  return formatISO9075(new Date(date));
};

// Get timestring format HH:mm | HH:mm:ss
export const dateToTimeStr = (date: Date | number, includingSeconds = false) => {
  return format(new Date(date), includingSeconds ? 'HH:mm:ss' : 'HH:mm');
};

export const dateToUTCTimeStr = (date: Date | number) => {
  return new Date(date).toISOString().replace(/T/, ' ').replace(/\..+/, '') + '(UTC)';
};

// Add minutes with string format HH:mm
export const addMinutesTimeStr = (hourStr: string, minutes: number) => {
  const dt = new Date();
  const hour = +hourStr.split(':')[0] || 0;
  const minuteAdded = (+hourStr.split(':')[1] || 0) + minutes;
  dt.setHours(hour);
  dt.setMinutes(minuteAdded);
  return dateToTimeStr(dt);
};

// Get datestring format yyyy-MM-dd
export const dateToDateStr = (date: Date | number) => {
  return format(new Date(date), 'yyyy-MM-dd');
};

// Get datestring format yyyy-MM-dd HH:mm:ss | yyyy-MM-dd HH:mm
export const dateToDatetimeStr = (date: Date | number, includingSeconds = false) => {
  return format(new Date(date), includingSeconds ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd HH:mm');
};

export const checkTimeIsSooner = (target: Date | string, dayFromTarget: number = 0) => {
  const now = new Date();
  const dt = new Date(target);
  dt.setDate(dt.getDate() - dayFromTarget);
  return now < dt;
};

/**
 *
 * @param date
 * @param minute
 * @returns
 */
export const addMinute = (date: Date, minute: number = 0) => {
  return addMinutes(date, minute);
};
