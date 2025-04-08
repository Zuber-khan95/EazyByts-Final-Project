import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {useFlash} from '../context/FlashContext.jsx'


export default function Layout() {
  const { user, logout }=useAuth();
  const {flash,updateFlash}=useFlash();
  let handleLogout=async()=>{
    try{
const response=await axios.post("http://localhost:5000/logout");
if(response.data.state==="success")
{
  logout();
  updateFlash({success:"Successfully logged out"});
  setTimeout(()=>{
    updateFlash({success:""});
  },4000);
  

}
    }
    catch(err)
    {
      updateFlash({error:"logged out Already"});
      setTimeout(()=>{
        updateFlash({error:""});
      },4000);
      console.error("Error:",err.response?err.response.data.message:"server error")
    }
  }
  
  return (
    <div>
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/">BookMyEvent</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/addEvent">Add New Event</Nav.Link>
            <Nav.Link href="/signup">Signup</Nav.Link>
            {!user? <Nav.Link href="/login">login</Nav.Link>: <Nav.Link onClick={handleLogout}>logout</Nav.Link>}
           
          </Nav>
          <Form className="d-flex">
   <Nav.Link href="/cart"><ShoppingCartIcon/></Nav.Link>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Outlet />  
    </div>
  );
}
