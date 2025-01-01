import { useState } from "react";
import Logo from "../components/Logo";
import toast from "react-hot-toast";
import axios from "axios";
import io from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_URL}`);

const JoinRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");

  const handleJoinRoom = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!roomName.trim()) {
      alert("Room name is required.");
      return;
    }

    if (!roomPassword.trim()) {
      alert("Room password is required.");
      return;
    }

    try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/game/join`,
          {
            gameId: roomName,
            password: roomPassword,
            userDetails: {
              name: localStorage.getItem("playerName"),
            },
          }
        );
        if (res.status !== 200) {
          toast.error(res.data || "An error occurred");
        }
        const data = await res.data;
        localStorage.setItem("roomName", data.name);
        localStorage.setItem("roomPassword", data.password);
        toast.success("Room joined successfully");
        socket.emit("updateRoom", {
          message: `${localStorage.getItem("playerName")} joined the room`,
          roomId: data._id.toString(),
        });
        window.location.href = `/room/${data._id}`;
    } catch (error) {
      console.error("Failed to join room:", error);
        toast.error(
          JSON.parse(error.request.response).message || "Failed to join room"
        );
    }

    // Clear inputs after submission or navigate to the room page
    setRoomName("");
    setRoomPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <Logo />

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Join a <span className="text-blue-400">Room</span>
        </h1>

        <form onSubmit={handleJoinRoom} className="space-y-6">
          <div>
            <label
              htmlFor="roomName"
              className="block text-sm font-medium text-gray-700"
            >
              Room Name
            </label>
            <input
              type="text"
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter room name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="roomPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Room Password
            </label>
            <input
              type="password"
              id="roomPassword"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter room password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};



export default JoinRoom;
