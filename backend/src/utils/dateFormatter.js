const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const isEventStarted = (eventDate) => {
  const now = new Date();
  const event = new Date(eventDate);
  return now > event;
};

export const isEventToday = (eventDate) => {
  const today = new Date();
  const event = new Date(eventDate);
  
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const eventDateOnly = new Date(event.getFullYear(), event.getMonth(), event.getDate());
  
  return todayDate.getTime() === eventDateOnly.getTime();
};

export const getEventStatus = (eventDate) => {
  const today = new Date();
  const event = new Date(eventDate);
  
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const eventDateOnly = new Date(event.getFullYear(), event.getMonth(), event.getDate());
  
  if (eventDateOnly < todayDate) return 'Completed';
  if (eventDateOnly.getTime() === todayDate.getTime()) return 'Ongoing';
  return 'Upcoming';
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Ongoing': return 'bg-green-100 text-green-800 border-green-200';
    case 'Completed': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};