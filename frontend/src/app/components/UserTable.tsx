// components/UserTable.tsx
"use client";
import React from "react";
import { User } from "../types";

interface UserTableProps {
  users: User[];
  selectedUser: User | null;
  onRowClick: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, selectedUser, onRowClick }) => (
  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
      <div className="overflow-hidden shadow ring-1 ring-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user.id}
                onClick={() => onRowClick(user)}
                className={`hover:bg-gray-100 ${selectedUser?.id === user.id ? "bg-blue-100" : ""}`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default UserTable;