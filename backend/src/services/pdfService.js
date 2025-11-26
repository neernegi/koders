// backend/src/services/pdfService.js
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { formatDate } from '../utils/dateFormatter.js';



export const generateBookingPDF = async (booking) => {
  try {
    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = 800;

    // ========= HEADER ========= //
    page.drawRectangle({
      x: 0,
      y: 720,
      width,
      height: 120,
      color: rgb(0.145, 0.388, 0.921) 
    });

    page.drawText('EventEase', {
      x: 50,
      y: 780,
      size: 26,
      font: fontBold,
      color: rgb(1, 1, 1)
    });

    page.drawText('Booking Confirmation', {
      x: 50,
      y: 750,
      size: 16,
      font: fontRegular,
      color: rgb(1, 1, 1)
    });

    const badgeWidth = fontBold.widthOfTextAtSize(booking.bookingId, 12) + 20;

    page.drawRectangle({
      x: 400,
      y: 760,
      width: badgeWidth,
      height: 25,
      color: rgb(0.117, 0.251, 0.686)
    });

    page.drawText(booking.bookingId, {
      x: 410,
      y: 767,
      size: 12,
      font: fontBold,
      color: rgb(1, 1, 1)
    });

   

    page.drawText('Thank You for Your Booking!', {
      x: 50,
      y: 690,
      size: 20,
      font: fontBold,
      color: rgb(0.12, 0.15, 0.18)
    });

    page.drawText(`Dear ${booking.user.name},`, {
      x: 50,
      y: 660,
      size: 12,
      font: fontRegular,
      color: rgb(0.42, 0.45, 0.50)
    });

    page.drawText(
      'Your event booking has been successfully confirmed. We look forward to seeing you at the event!',
      {
        x: 50,
        y: 640,
        size: 12,
        font: fontRegular,
        color: rgb(0.42, 0.45, 0.50),
        maxWidth: 500
      }
    );


    page.drawText('Event Details', {
      x: 50,
      y: 600,
      size: 16,
      font: fontBold,
      color: rgb(0.07, 0.08, 0.1)
    });

    const eventFields = [
      ['Event Title', booking.event.title],
      ['Date & Time', `${formatDate(booking.event.date)} at ${new Date(booking.event.date).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}`],
      ['Location', `${booking.event.location} (${booking.event.locationType})`],
      ['Category', booking.event.category],
      ['Organizer', booking.event.organizer || 'EventEase']
    ];

    y = 570;
    eventFields.forEach((row, index) => {
      if (index % 2 === 0) {
        page.drawRectangle({
          x: 50, y: y - 5, width: 500, height: 25,
          color: rgb(0.976, 0.98, 0.984)
        });
      }

      page.drawText(`${row[0]}:`, {
        x: 60,
        y,
        size: 10,
        font: fontBold,
        color: rgb(0.21, 0.23, 0.28)
      });

      page.drawText(row[1], {
        x: 150,
        y,
        size: 10,
        font: fontRegular,
        color: rgb(0, 0, 0)
      });

      y -= 25;
    });

   
    y -= 10;
    page.drawText('Booking Information', {
      x: 50,
      y,
      size: 16,
      font: fontBold,
      color: rgb(0.07, 0.08, 0.1)
    });

    const bookingFields = [
      ['Booking ID', booking.bookingId],
      ['Booking Date', formatDate(booking.bookingDate)],
      ['Number of Seats', booking.seats.toString()],
      ['Total Amount', `$${booking.totalAmount.toFixed(2)}`],
      ['Booking Status', booking.status.toUpperCase()]
    ];

    y -= 30;

    bookingFields.forEach((row, index) => {
      if (index % 2 === 0) {
        page.drawRectangle({
          x: 50, y: y - 5, width: 500, height: 25,
          color: rgb(0.94, 0.98, 1) 
        });
      }

      page.drawText(`${row[0]}:`, {
        x: 60,
        y,
        size: 10,
        font: fontBold,
        color: rgb(0.21, 0.23, 0.28)
      });

      let color = rgb(0, 0, 0);

      if (row[0] === 'Total Amount') color = rgb(0.02, 0.59, 0.41);
      if (row[0] === 'Booking Status')
        color = booking.status === 'confirmed'
          ? rgb(0.02, 0.59, 0.41)
          : rgb(0.86, 0.15, 0.15);

      page.drawText(row[1], {
        x: 150,
        y,
        size: 10,
        font: fontRegular,
        color
      });

      y -= 25;
    });

    // ========= FOOTER ========= //

    page.drawLine({
      start: { x: 50, y: 80 },
      end: { x: 550, y: 80 },
      thickness: 1,
      color: rgb(0.9, 0.9, 0.9)
    });

    page.drawText('Need assistance? Contact support@eventease.com', {
      x: 50,
      y: 60,
      size: 9,
      font: fontRegular,
      color: rgb(0.4, 0.42, 0.45)
    });

    page.drawText('Generated with EventEase Booking System', {
      x: 50,
      y: 40,
      size: 9,
      font: fontRegular,
      color: rgb(0.4, 0.42, 0.45)
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);

  } catch (err) {
    console.error('PDF Generation Error:', err);
    throw err;
  }
};


export const simulateEmailConfirmation = (booking, pdfBuffer) => {
  const emailContent = `
  ==============================================
   EVENTEASE - BOOKING CONFIRMATION
  ==============================================
  
  Dear ${booking.user.name},
  
  Your booking has been confirmed! We're excited to have you join us.
  
  📅 EVENT DETAILS:
  • Event: ${booking.event.title}
  • Date: ${formatDate(booking.event.date)}
  • Time: ${new Date(booking.event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
  • Location: ${booking.event.location} (${booking.event.locationType})
  • Category: ${booking.event.category}
  
  🎫 BOOKING INFORMATION:
  • Booking ID: ${booking.bookingId}
  • Seats Reserved: ${booking.seats}
  • Total Amount: $${booking.totalAmount.toFixed(2)}
  • Booking Date: ${formatDate(booking.bookingDate)}
  • Status: ${booking.status.toUpperCase()}
  
  📍 IMPORTANT NOTES:
  • Please arrive 15 minutes before the event starts
  • Bring this confirmation (or the attached PDF) and a valid ID
  • For online events, the join link will be sent separately
  
  ❓ NEED HELP?
  Contact our support team at support@eventease.com
  or call us at +1 (555) 123-EVENT
  
  Thank you for choosing EventEase!
  We look forward to seeing you at the event!
  
  ==============================================
  Generated on: ${new Date().toLocaleString()}
  ==============================================
  `;

  console.log('📧 Email Confirmation Simulated:');
  console.log(emailContent);
  console.log(`📎 PDF Attachment Size: ${pdfBuffer.length} bytes`);
  console.log(`📤 Sent to: ${booking.user.email}`);

  return {
    success: true,
    message: 'Email confirmation simulated successfully',
    email: booking.user.email,
    timestamp: new Date().toISOString(),
    pdfAttached: true,
    pdfSize: pdfBuffer.length
  };
};