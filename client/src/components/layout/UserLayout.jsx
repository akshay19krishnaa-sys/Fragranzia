import React from 'react'
import Navbar from '../user/Navbar'
import Footer from '../user/Footer'

const UserLayout = ({children}) => {
  return (
   <div>
        <div>
        <Navbar/>
        </div>
       
        <div>
            {children}
        </div>
         <div>
            <Footer/>
        </div>
    </div>
  )
}

export default UserLayout
