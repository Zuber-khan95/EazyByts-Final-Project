import LocationOnIcon from '@mui/icons-material/LocationOn';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
export default function Card({data}){
    return (
        <div style={{ color:"voilet" }}>
            <span ><b>{data.title}</b></span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           
            <span >{data.startDate.slice(0,10)} to {data.endDate.slice(0,10)}</span>
           <p style={{textAlign:"left"}}>{data.description}</p> 
        <h6 ><LocationOnIcon/>{data.location}</h6>
        <p><b>Category:{data.category}</b></p>
        <p><b>Price:<CurrencyRupeeIcon/>{data.price}</b></p>
        <p><b>status:{data.status}</b></p>
        <p><b>Available Tickets: {data.availableTickets}</b></p>
        <p><b>Owner: {data.owner.username}</b></p>

        </div>
    );
}