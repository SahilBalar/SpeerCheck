// src/utils/availability.js
export const isTimeInRange = (time, timeRange) => {
  const [start, end] = timeRange.split('-');
  const [startHour, startMin] = start.split(':');
  const [endHour, endMin] = end.split(':');
  const [timeHour, timeMin] = time.split(':');
  
  const startTime = parseInt(startHour) * 60 + parseInt(startMin);
  const endTime = parseInt(endHour) * 60 + parseInt(endMin);
  const checkTime = parseInt(timeHour) * 60 + parseInt(timeMin);
  
  return checkTime >= startTime && checkTime <= endTime;
};

export const getAvailableSlots = (engineer, candidate) => {
  const { day, start, end } = candidate.preferredTime;
  const availableSlots = engineer.availability[day]
    .filter(slot => isTimeInRange(slot, `${start}-${end}`));
  
  return availableSlots;
};