import { useState } from "react";
import Logo from "../components/Logo";
import axios from "axios";
import toast from "react-hot-toast";

const CreateRoom = () => {
    const [initialAmount, setInitialAmount] = useState("");
    const [roomPassword, setRoomPassword] = useState("");
    const [maxPlayers, setMaxPlayers] = useState(4); // Default to 4 players

    const handleCreateRoom = async (e) => {
      e.preventDefault();

      // Basic validation
      if (!initialAmount || initialAmount <= 0) {
        alert("Please enter a valid initial amount.");
        return;
      }

      // Save room settings to local storage or backend
      
      try {
        const res = await axios.post(
          "http://localhost:3000/game/create",
          {
            userDetails: {
              name: localStorage.getItem("playerName"),
            },
            initialAmount: initialAmount,
            password: roomPassword,
            maxPlayers: maxPlayers,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (res.status !== 200) {
          toast.error(res.data || "An error occurred");
        }
        const data = res.data;
        localStorage.setItem("roomName", data.name);
        localStorage.setItem("roomPassword", data.password);
        toast.success("Room created successfully");
        window.location.href  = `/room/${data._id}`;
      } catch (error) {
        console.error("Failed to create room:", error);
        return;
      }      
      setInitialAmount("");
      setRoomPassword("");
      setMaxPlayers(4);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          <Logo />

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create a <span className="text-blue-400">New Room</span>
          </h1>

          <form onSubmit={handleCreateRoom} className="space-y-6">
            <div>
              <label
                htmlFor="initialAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Initial Amount Per Player
              </label>
              <input
                type="number"
                id="initialAmount"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter initial amount"
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
                type="text"
                id="roomPassword"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter room password"
                required
              />
            </div>

            <div>
              <label
                htmlFor="maxPlayers"
                className="block text-sm font-medium text-gray-700"
              >
                Maximum Players
              </label>
              <div className="slider-container">
                <input
                  type="range"
                  id="maxPlayers"
                  className="slider mt-2 block w-full"
                  min="2"
                  max="16"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-600 text-center mt-1">
                Selected: <span className="font-medium">{maxPlayers}</span>{" "}
                players
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Room
            </button>
          </form>
        </div>
      </div>
    );

}

export default CreateRoom
