"use client";
import Spinner from "@/app/components/Spinner";
import API_URL from "@/app/utils/apiConfig";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

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
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
      setLoading(true);
      // Fetch the users data if it is the delete or the edit action
      if (userId && (action === "edit" || action === "delete")) {
          fetch(`${API_URL}/users/${userId}`)
              .then((response) => response.json())
              .then((data) => setUser(data))
              .catch((error) => console.error("Error fetching user data:", error));
      }


      setLoading(false);
  }, [userId, action]);


  const handleUpdateUser = () => {
    fetch(`${API_URL}/users/${userId}`, {
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
      toast("Failed to update the user");
    });
    // Display a success message to the user
    toast("Successfully updated the user");
  };


  const handleDeleteUser = () => {
    fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
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
      console.log("User deleted:", data);
      router.replace("/users");
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
      toast("Failed to delete the user");
    });
    toast("Successfully deleted the user");
  };


  const handleCreateUser = () => {
    fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
      }),
    })
    .then(async response => {
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }
      return response.json()
    })
    .then((data) => {
      console.log("User created:", data);
      router.replace("/users");
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      toast("Failed to create the user");
    });
    // Display a success message to the user
    toast("Successfully created the user");
  };

  const handleInputChange = (field: keyof typeof user, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate the user input
    if (!user.name || !user.email) {
      alert("Please fill out all fields.");
      return;
    }
    
    setLoading(true);

    if (action === "edit") {
      handleUpdateUser();
    } else if (action === "delete") {
      // Ask for confirmation before deleting the user
      const isConfirmed = window.confirm("Are you sure you want to delete this user?");
      isConfirmed ? handleDeleteUser() : console.log("User deletion cancelled.");
    }else{
      // Create a new user
      handleCreateUser();
    }

    setLoading(false);
    router.push("/users");
  };
  


  // Render the spinner if the data is still loading
  if(isLoading){
    return <Spinner />;
  }
  // Otherwise, render the user details form
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
        {action === "delete"  && (
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
            {action === "delete" ? "Delete" : action === "edit" ? "Save" : "Create"}
        </button>
      </div>
    </div>
  );
}


export default UserDetails;