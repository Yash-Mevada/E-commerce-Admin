import React from "react";

function Users() {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="text-3xl font-bold">Users</div>
          <div>7 Users</div>
        </div>
        <div>
          <button className="px-4 py-2 bg-orange-500 text-white rounded">
            + Add User
          </button>
        </div>
      </div>
      <div>
        <table>
          <thead>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </thead>
          <tbody>
            <td>Payal</td>
            <td>Admin</td>
            <td>Active</td>
            <td>10/02/2002</td>
            <td></td>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Users;
