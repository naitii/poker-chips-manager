import { useState } from "react";
import FormInput from "./FormInput";
import { Link } from "react-router-dom";

function RoomForm() {
  const [username, setUsername] = useState("");

  const saveUsername = () => {
    localStorage.setItem("playerName", username);
  };

  return (
    <form className="space-y-6">
      <FormInput
        id="username"
        label="Your Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your name"
        required
        minLength={2}
        maxLength={30}
      />

      <div className="flex gap-5">
        <Link
          to="/create"
          onClick={saveUsername}
          className={`w-1/2 text-center bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${
            !username.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Create Room
        </Link>
        <Link
          to="/join"
          onClick={saveUsername}
          className={`w-1/2 text-center bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${
            !username.trim() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Join Room
        </Link>
      </div>
    </form>
  );
}

export default RoomForm;
