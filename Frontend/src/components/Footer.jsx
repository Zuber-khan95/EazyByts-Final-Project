import './Footer.css'
export default function Footer()
{
    return (
<footer className="Footer Footer_text">
  
    <a href="#" className="Footer_links"><i className="bi bi-facebook"></i></a>
    <a href="#" className="Footer_links"><i className="bi bi-twitter"></i></a>
    <a href="#" className="Footer_links"><i className="bi bi-instagram"></i></a>

    <p >&copy; {new Date().getFullYear()} BookMyEvent. Stay Connected.</p>
    <p>All rights reserved.</p>
</footer>
    )
};