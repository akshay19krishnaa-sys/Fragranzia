import React, { useEffect, useState } from "react";
import "./Customers.css";
import AdminUserService from "../../services/admin-api-service/AdminService";

function Customers() {

  const [users, setUsers] = useState([]);

  const { getUsers, toggleBlock } = AdminUserService();

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlock = async (id) => {
    await toggleBlock(id);
    fetchUsers();
  };

  return (
    <div className="customers">

      <h2>Customers</h2>

      <table>

        <thead>

          <tr>

            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {users.map((user,index)=>(

            <tr key={user._id}>

              <td>{index+1}</td>

              <td>{user.name}</td>

              <td>{user.email}</td>

              <td>{user.phone || "N/A"}</td>

              <td>

                {user.isBlocked
                ?
                <span className="blocked">Blocked</span>
                :
                <span className="active">Active</span>
                }

              </td>

              <td>

                <button
                className={
                  user.isBlocked
                  ?
                  "unblockBtn"
                  :
                  "blockBtn"
                }
                onClick={()=>handleBlock(user._id)}
                >

                  {user.isBlocked ? "Unblock":"Block"}

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Customers;