import React from 'react'
import UserLayout from '../layout/UserLayout'
import { Outlet } from 'react-router-dom'

const UserProductRouter = () => {
  return (
    <UserLayout>
        <Outlet/>
   </UserLayout>
  )
}

export default UserProductRouter
