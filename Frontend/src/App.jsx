import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter , Routes, Route } from 'react-router-dom'
import Layout from "./pages/Layout.jsx"
import Home from './pages/Home.jsx'
import Login from "./pages/Login.jsx"
import Signup from './pages/Signup.jsx'
import AddEvent from './pages/AddEvent.jsx'
import Cart from './pages/Cart.jsx'
import './App.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { FlashProvider } from './context/FlashContext.jsx'
import ProtectedRoute from './context/ProtectedRoute.jsx'
import TicketForm from './pages/TicketForm.jsx'
function App() {

  return (
    <>
    <AuthProvider>
      <FlashProvider>
      <BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout/>}>
    <Route index element={<Home/>}/>
    <Route path="login" element={<Login/>}/>
    <Route path="signup" element={<Signup/>}/>
    <Route path="addEvent" element={
         <ProtectedRoute>
          <AddEvent/>
        </ProtectedRoute>
     }/>
    <Route path="cart" element={
      <ProtectedRoute>
  <Cart/>
      </ProtectedRoute>
    }/>
    <Route path="ticketForm/:id" element={
      <ProtectedRoute>
        <TicketForm/>
        </ProtectedRoute>}/>
    </Route>
  </Routes>
  </BrowserRouter>
      </FlashProvider>
    </AuthProvider>

    </>
  )
}

export default App
