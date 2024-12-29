"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserTable from "../components/UserTable";
import { User } from "../types";

const UsersPage: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    fetch("http://localhost:8080/users")
    .then((response) => response.json())
    .then((data) => setUsers(data))
    .catch((error) => console.error("Error fetching users:", error))
  }, []);

  const handleNavigation = (action: string) => {
    if (!selectedUser) return;
  
    const route = `/users/${selectedUser.id}?action=${action}`;
    router.push(route);
  };
  

  return (
    <div className="flex flex-col h-screen bg-gray-100">
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
