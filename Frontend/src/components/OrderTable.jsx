import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useEffect,useState } from 'react';

const columns = [
  { field: 'id', headerName: 'Ticket Id', width: 160 },
  { field: 'title', headerName: 'Event Name', width: 160 },
  { field: 'location', headerName: 'Location', width: 105 },
  { field: 'quantity', headerName: 'Quantity', width: 105 },
  { field: 'price', headerName: 'Price', width: 105 },
  { field: 'type', headerName: 'Ticket Type', width: 105 },
  { field: 'status', headerName: 'Status', width: 105 },
  { field: 'seatNo', headerName: 'Seat Nos', width: 105 },
  { field: 'date', headerName: 'Booking Date', width: 105 },
  { field: 'user', headerName: 'Customer Name', width: 105 },


];



const paginationModel = { page: 0, pageSize: 5 };

export default function OrderTable({data}) {
let [rows,setRows]=useState([]);

  useEffect(() => {
    if (data.length > 0) {
      const mappedRows = data.map((item, index) => ({
        id: item._id,
        title: item.event.title,
        location: item.event.location,
        quantity:item.quantity,
        type:item.ticketType,
        user:item.user.username,
        seatNo:item.seatNo.map((seat)=>seat),
        price:item.price,
        date:item.date.slice(0,10),
        status:item.status
      
      }));
      setRows(mappedRows);
    }
  }, [data]);
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}