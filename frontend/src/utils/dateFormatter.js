const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

export const isEventStarted = (eventDate) => {
  const now = new Date();
  const event = new Date(eventDate);
  return now > event;
};

export const getEventStatus = (eventDate) => {
  const today = new Date();
  const event = new Date(eventDate);
  
  if (event < today) return 'Completed';
  if (event.toDateString() === today.toDateString()) return 'Ongoing';
  return 'Upcoming';
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Upcoming': return 'bg-blue-100 text-blue-800';
    case 'Ongoing': return 'bg-green-100 text-green-800';
    case 'Completed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};