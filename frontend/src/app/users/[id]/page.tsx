"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const UserDetails: React.FC = () => {
  const { id } = useParams(); // Get the 'id' from the path
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const userId = id && typeof id === 'string' ? parseInt(id, 10) : null;
  const router = useRouter();
  const [user, setUser] = useState<{ id?: number; name: string; email: string }>({
      name: "",
      email: "",
  });

  useEffect(() => {
      if (userId && (action === "edit" || action === "delete")) {
          fetch(`http://localhost:8080/users/${userId}`)
              .then((response) => response.json())
              .then((data) => setUser(data))
              .catch((error) => console.error("Error fetching user data:", error));
      }
  }, [userId, action]);


  const handleUpdateUser = () => {
    fetch(`http://localhost:8080/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
        name: user.name,
        email: user.email,
      }),
    })
    .then(async response => {
      if (!response.ok) {
        // Handle non-2xx HTTP responses
        const err = await response.json();
        throw new Error(err.message);
      }
      return response.json()
    })
    .then((data) => {
      console.log("User updated:", data);
      router.replace("/users");
    })
    .catch((error) => {
      console.error("Error updating user:", error);
      // You can display a user-friendly error message here
    });
  };

  const handleInputChange = (field: keyof typeof user, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!user.name || !user.email) {
      alert("Please fill out all fields.");
      return;
    }


    if (action === "edit") {
      console.log("Updating user:", user);
      handleUpdateUser();
    } else if (action === "delete") {
      console.log("Deleting user:", user.id); // Simulate API call for deletion
    }

    router.push("/users");
  };

  return (
    <div className="p-8 bg-gray-100 h-screen">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">
        {action === "edit"
          ? "Edit User Details"
          : action === "delete"
          ? "Delete User"
          : "Create New User"}
      </h1>
      <form className="space-y-4">
        {userId && (
          <div>
            <label className="block font-medium text-gray-700">ID</label>
            <input
              type="text"
              defaultValue={user.id}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
        )}
        {action !== "delete" && (
          <>
            <div>
              <label className="block font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter user name"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter user email"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </form>
      <div className="flex justify-end mt-6 space-x-4">
        <button
          onClick={() => router.push("/users")}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded shadow-md"
        >
          Cancel
        </button>
        <button
            onClick={handleSubmit}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded shadow-md">
            {action === "delete" ? "Delete" : action === "edit" ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
}


export default UserDetails;