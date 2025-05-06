// src/components/Calendar.jsx
import React, { useState, useMemo } from 'react';
import { isTimeInRange, getAvailableSlots } from '../utils/availability';

const Calendar = ({ candidates = [], engineers = [], selectedCandidate, onCandidateSelect }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('30');
  const [showModal, setShowModal] = useState(false);
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [error, setError] = useState(null);
  const [viewInterview, setViewInterview] = useState(null);


  const timeSlots = useMemo(() => {
    const slots = [];
    let hour = 9;
    let minute = 0;
    const endHour = 17;
    const interval = Number(selectedDuration);
  
    while (hour < endHour || (hour === endHour && minute === 0)) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeStr);
      minute += interval;
      if (minute >= 60) {
        hour += Math.floor(minute / 60);
        minute = minute % 60;
      }
    }
  
    return slots;
  }, [selectedDuration]);  

  const isSlotBooked = (time, day) => {
    return scheduledInterviews.some(interview =>
      interview.time.day === day &&
      interview.time.time === time
    );
  };

  const getNextTime = (time, duration) => {
    const [hours, minutes] = time.split(':').map(Number);
    let newMinutes = minutes + Number(duration);
    let newHours = hours;

    if (newMinutes >= 60) {
      newHours += Math.floor(newMinutes / 60);
      newMinutes = newMinutes % 60;
    }

    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  };

  const handleTimeSlotClick = (time, day, engineer) => {
    const bookedInterview = scheduledInterviews.find(
      interview => interview.time.day === day && interview.time.time === time
    );

    if (bookedInterview) {
      setViewInterview(bookedInterview);
      return;
    }

    if (!selectedCandidate || !selectedEngineer) {
      setError('Please select both a candidate and an engineer first');
      return;
    }

    const candidateTimeRange = `${selectedCandidate.preferredTime.start}-${selectedCandidate.preferredTime.end}`;
    if (isTimeInRange(time, candidateTimeRange)) {
      const availableSlots = getAvailableSlots(engineer, selectedCandidate);
      if (availableSlots.includes(time)) {
        setSelectedTime({ time, day, duration: selectedDuration });
        setSelectedEngineer(engineer);
        setShowModal(true);
        setError(null);
      } else {
        setError('This time slot is not available');
      }
    } else {
      setError('This time is outside the candidate\'s preferred time range');
    }
  };

  const handleScheduleInterview = () => {
    if (selectedTime && selectedEngineer && selectedCandidate) {
      const interview = {
        candidate: selectedCandidate,
        engineer: selectedEngineer,
        time: selectedTime,
        scheduledAt: new Date().toISOString(),
        duration: selectedDuration
      };

      setScheduledInterviews(prev => [...prev, interview]);
      setShowModal(false);
      setSelectedTime(null);
      setSelectedEngineer(null);
      setError(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {error && (
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Candidate
            </label>
            <select
              value={selectedCandidate?.id || ''}
              onChange={(e) => {
                const candidateId = parseInt(e.target.value);
                const candidate = candidates.find(c => c.id === candidateId);
                if (candidate) {
                  onCandidateSelect(candidate);
                }
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select a candidate</option>
              {candidates.map(candidate => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Engineer
            </label>
            <select
              value={selectedEngineer?.id || ''}
              onChange={(e) => {
                const engineerId = parseInt(e.target.value);
                const engineer = engineers.find(e => e.id === engineerId);
                if (engineer) {
                  setSelectedEngineer(engineer);
                }
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select an engineer</option>
              {engineers.map(engineer => (
                <option key={engineer.id} value={engineer.id}>
                  {engineer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mt-6">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
          <div key={day} className="space-y-2">
            <h3 className="text-sm font-medium text-gray-600">{day}</h3>
            <div className="space-y-1">
              {timeSlots.map(time => {
                // Only filter by candidate's preferred day when checking availability
                const isBooked = isSlotBooked(time, day);
                const isAvailable = selectedEngineer ?
                  selectedEngineer.availability[day]?.includes(time) :
                  false;

                // Check if time is within candidate's preferred time range
                const isWithinRange = selectedCandidate ?
                  isTimeInRange(time, `${selectedCandidate.preferredTime.start}-${selectedCandidate.preferredTime.end}`) :
                  true;

                return (
                  <div
                    key={time}
                    onClick={() => handleTimeSlotClick(time, day, selectedEngineer)}
                    className={`p-2 rounded cursor-pointer ${isBooked ? 'bg-red-100 text-red-700' :
                        isAvailable && isWithinRange ? 'bg-green-100 hover:bg-green-200' :
                          'bg-gray-100'
                      }`}
                  >
                    {time}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Confirm Interview
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Engineer: {selectedEngineer?.name}
                </p>
                <p className="text-sm text-gray-500">
                  Candidate: {selectedCandidate?.name}
                </p>
                <p className="text-sm text-gray-500">
                  Time: {selectedTime?.time} {selectedTime?.day}
                </p>
                <p className="text-sm text-gray-500">
                  Duration: {selectedDuration} minutes
                </p>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={handleScheduleInterview}
                className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Schedule Interview
              </button>
            </div>
          </div>
        </div>
      )}
      {viewInterview && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Interview Details</h3>
              <p className="text-sm text-gray-500 mt-2">
                Candidate: {viewInterview.candidate.name}
              </p>
              <p className="text-sm text-gray-500">
                Engineer: {viewInterview.engineer.name}
              </p>
              <p className="text-sm text-gray-500">
                Time: {viewInterview.time.time} {viewInterview.time.day}
              </p>
              <p className="text-sm text-gray-500">
                Duration: {viewInterview.duration} minutes
              </p>
              <button
                onClick={() => setViewInterview(null)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Calendar;