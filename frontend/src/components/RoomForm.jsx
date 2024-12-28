import React, { useState } from "react";
import FormInput from "./FormInput";

function RoomForm() {
  const [username, setUsername] = useState("");

  const handleCreateRoom = (e) => {
    e.preventDefault();
    console.log("Creating room with username:", username);
  };

  return (
    <form onSubmit={handleCreateRoom} className="space-y-6">
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
        <button
          type="submit"
          disabled={!username.trim()}
          className="w-1/2 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Room
        </button>
        <button
          type="submit"
          disabled={!username.trim()}
          className="w-1/2 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Join Room
        </button>
      </div>
    </form>
  );
}

export default RoomForm;
