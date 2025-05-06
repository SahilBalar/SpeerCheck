export const getEngineers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
  
      const timeSlots = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
  
      return data.map((user, index) => {
        const availability = {};
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        days.forEach(day => {
          const startIndex = Math.floor(Math.random() * (timeSlots.length - 8));
          availability[day] = timeSlots.slice(startIndex, startIndex + 8);
        });
  
        return {
          id: index + 1,
          name: user.name,
          availability
        };
      });
    } catch (error) {
      console.error('Error fetching engineers:', error);
      return [];
    }
  };
  export const getCandidates = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await response.json();
  
      const timeSlots = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
      return data.slice(0, 5).map((post, index) => {
        const day = days[Math.floor(Math.random() * days.length)];
        const startIndex = Math.floor(Math.random() * (timeSlots.length - 8));
        const candidateSlots = timeSlots.slice(startIndex, startIndex + 8);
  
        return {
          id: index + 1,
          name: `Candidate ${index + 1}`,
          preferredTime: {
            day,
            start: candidateSlots[0],
            end: candidateSlots[candidateSlots.length - 1]
          }
        };
      });
    } catch (error) {
      console.error('Error fetching candidates:', error);
      return [];
    }
  };
    