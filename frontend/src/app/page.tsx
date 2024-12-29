import Link from 'next/link';

const GreetingsPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Welcome to the User Management App!
        </h1>
        <p className="text-gray-700 mb-6">
          Click the button below to manage users.
        </p>
        <Link href="/users" className="w-full"> {/* Added w-full here */}
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"> {/* Added w-full here */}
            Go to User Management
          </button>
        </Link>
      </div>
    </div>
  );
};

export default GreetingsPage;