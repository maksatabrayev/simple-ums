"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserTable from "../components/UserTable";
import { User } from "../types";
import API_URL from "../utils/apiConfig";
import Spinner from "../components/Spinner";

const UsersPage: React.FC = () => {
  const router = useRouter();
const [users, setUsers] = useState<User[]>([]);
const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [isLoading, setLoading] = useState(false);

const handleRowClick = (user: User) => {
  setSelectedUser(user);
};

useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);

const handleNavigation = (action: string) => {
  // if the action is new, navigate to the  user details page without the selected user
  if (!selectedUser && action == "new") {
    router.push(`/users/action=${action}`);
    return;
  }
  else if (!selectedUser) {
    alert("Please select a user to perform this action");
    return;
  }
  // otherwise, navigate to the user details page with the selected user
  const route = `/users/${selectedUser.id}?action=${action}`;
  router.push(route);
};


  
  // Render the spinner if the data is still loading
  if(isLoading){
    return <Spinner />;
  }
  // Otherwise, render the user details form
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-700 m-4">
        Select a User to Perform an Action
      </h1>
      <div className="flex-grow overflow-y-auto px-8 py-4">
        <UserTable users={users} selectedUser={selectedUser} onRowClick={handleRowClick} />
        <div className="mt-4 flex justify-end">
          <div className="flex justify-evenly">
            <button
              onClick={() => handleNavigation("new")}
              className="bg-green-500 hover:bg-green-700 text-white font-bold mx-2 py-2 px-4 rounded shadow-md"
            >
              New
            </button>
            <button
              onClick={() => handleNavigation("edit")}
              disabled={!selectedUser}
              className={`mx-2 py-2 px-4 rounded shadow-md font-bold text-white ${
                selectedUser
                  ? "bg-blue-500 hover:bg-blue-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => handleNavigation("delete")}
              disabled={!selectedUser}
              className={`mx-2 py-2 px-4 rounded shadow-md font-bold text-white ${
                selectedUser
                  ? "bg-red-500 hover:bg-red-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
