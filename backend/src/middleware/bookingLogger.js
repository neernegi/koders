export const bookingLogger = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    try {
      const response = JSON.parse(data);
      
      if (req.method === 'POST' && req.originalUrl.includes('/bookings') && response.success) {
        console.log(`📅 New Booking Created - User: ${req.user?.id}, Booking ID: ${response.data?.bookingId}, Timestamp: ${new Date().toISOString()}`);
      }
    } catch (error) {
      // Not JSON response, ignore
    }
    
    originalSend.call(this, data);
  };
  
  next();
};