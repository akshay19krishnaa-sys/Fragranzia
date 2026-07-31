import { useState } from 'react'
import { Link } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { IoCallOutline } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io";
import "../../style/footer.css";



const Footer = () =>{

    return (

        <>
        <footer>
            <div className="main-footer">

            
            <div className="heading-footer">
                <h1>Fragranzia</h1>
            </div>
            <div className="main1-footer">
                <div className="pages-footer">
                    <h4>Pages</h4>
                    <p>home</p>
                    <p>product</p>
                    <p>gifting</p>
                    <p>about</p>
                </div>
                <div className="links-footer">
                    <h4>Quick-links</h4>
                    <p>privacy policy</p>
                    <p> terms and conditions</p>
                    <p>FAQs</p>
                    <p>costomer services</p>

                </div>
                <div className="contact-media">
                    <p><span><MdOutlineMail /></span>fragranzia@gmail.com</p>
                    <p><span><IoCallOutline /></span>9933445562</p>   


                    <h4>Social Media</h4>
                    <div className="social-media">
                        
                        <FaInstagram />
                        <FaFacebook />
                        <FaXTwitter />
                        <FaYoutube />
                        <IoLogoLinkedin />




                        
                    </div>

                </div>
            </div>
            </div>
            <div className='details'>
                <div className="details1">
                <p>web accessbility | </p>
                <p>terms of use |</p>
                <p>privacy statement |</p>
                <p>contact us</p>
                </div>
                <div className="details2">
                    <p>2026 all fragranzia rigts reserved</p>
                </div>
            </div>
            
        </footer>

        </>
    )

}
export default Footer