import React from 'react';
import './Ticket.css'; // We'll create this next

export default  function Ticket ({data}) {
  const getStatusClass = () => {
    switch (data.status.toLowerCase()) {
      case 'active':
        return 'status_active';
      case 'cancelled':
        return 'status_cancelled';
      case 'expired':
        return 'status_expired';
      default:
        return '';
    }
  };
  const getTicketTypeClass = () => {
    switch (data.ticketType.toLowerCase()) {
      case 'diamond':
        return 'ticket_type_diamond';
      case 'gold':
        return 'ticket_type_gold';
      case 'silver':
        return 'ticket_type_silver';
      default:
        return '';
    }
  };



  return (
    <div >
      <div className="ticket-header">
        <div className="event-name">{ data.event.title}</div>
        <div className="ticket-type-label"><span className={`${getTicketTypeClass()}`}>{data.ticketType}</span></div>
      </div>
      <div className="ticket-body">
        <div className="ticket-row"><span className="label">Customer:</span><span className="value">{data.user.username}</span></div>
        <div className="ticket-row"><span className="label">Place:</span><span className="value">{data.event.location}</span></div>
        <div className="ticket-row"><span className="label">Date:</span><span className="value">{data.date.substring(0,10)}</span></div>
        <div className="ticket-row"><span className="label">Status:</span><span className={getStatusClass()}>{data.status}</span></div>
        <div className="ticket-row"><span className="label">Quantity:</span><span className="value">{data.quantity}</span></div>
        <div className="ticket-row"><span className="label">Price:</span><span className="value">&#8377;{data.price}</span></div>
        {data.seatNo.length>0 && <div className="ticket-row"><span className="label">Seat No:</span><span className="value">{data.seatNo.map((seatNo, index) => (
          <span key={index} className="seat-number">{seatNo}{index < data.seatNo.length - 1 ? ', ' : ''}</span>
        ))}</span></div>}
    </div>
    </div>
  );
};

