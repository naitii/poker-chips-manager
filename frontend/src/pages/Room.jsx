import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import io from "socket.io-client";

const socket = io.connect('http://localhost:3000');

const Room = () => {
    const [roomName, setRoomName] = useState("");
    const [roomPassword, setRoomPassword] = useState("");
    const [players, setPlayers] = useState([]);
    const [gameDetails, setGameDetails] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [actionType, setActionType] = useState("");
    const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
    const [votedPlayer, setVotedPlayer] = useState("");
    const roomId = useParams().roomId;
    const playerName = localStorage.getItem("playerName");
    const [showVotePopup, setShowVotePopup] = useState(false);


  useEffect(() => {
    // Check if the popup needs to be shown
    const currentPlayer = players.find((p) => p.name === playerName);
    if (
      currentPlayer &&
      !currentPlayer.acceptWinner &&
      gameDetails.currentRoundWinner !== ""
    ) {
      setShowVotePopup(true);
    }
  }, [gameDetails, players, playerName]);

  const handleVote = async (accepted) => {
    try {
        if(accepted){
            const response = await axios.post(
                "http://localhost:3000/action/vote",
                {
                    gameName: roomName,
                    playerName,
                    vote: true,
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            
            if (response.status === 200) {
                toast.success(
                    `You have accepted the winner.`
                );
            } else {
              toast.error(response.data.message || "Failed to submit your vote.");
            }
        }
        setShowVotePopup(false);
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error(
        JSON.parse(error?.request?.response)?.message ||
          "Failed to submit your vote."
      );
    }
  };

  // Fetch room details on component mount
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const storedRoomName = localStorage.getItem("roomName");
        const storedRoomPassword = localStorage.getItem("roomPassword");
        setRoomName(storedRoomName || "");
        setRoomPassword(storedRoomPassword || "");

        const response = await axios.get(
          `http://localhost:3000/game/${roomId}`
        );
        if (response.status === 200) {
          setPlayers(response.data.players);
          setGameDetails(response.data);
          socket.emit("join_room", roomId.toString());
        } else {
          toast.error(response.data.message || "Failed to fetch room details");
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
        toast.error(
          "Failed to fetch room details"
        );
      }
    };

    if (roomId) fetchRoomDetails();

    
  }, [roomId]);


  useEffect(() => {
    socket.on("updateData", async (data) => {
      await axios.get(`http://localhost:3000/game/${roomId}`).then((res) => {
        setPlayers(res.data.players);
        setGameDetails(res.data);
        if(data)
            toast(data, {
            style: {
                border: "1px solid #4f46e5",
                padding: "16px",
            },
            });
        });
    });
    socket.on("refresh", () => {
        console.log("refreshing room");
        location.reload();
    });
    return () => {
      socket.off("updateData");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[socket]);


  const handleOpenModal = (type) => {
    const player = players.find((p) => p.name === playerName);
    const maxAmount =
      type === "raise"
        ? Math.max(0, (player?.amount || 0) - (gameDetails.currentBet || 0))
        : player?.amount || 0;

    if (maxAmount <= 0) {
      toast.error("You can't raise. Insufficient funds.");
      return;
    }

    setSelectedAmount(maxAmount / 2);
    setActionType(type);
    setIsModalOpen(true);
  };

  const handleSliderChange = (event) => {
    setSelectedAmount(Number(event.target.value));
  };

  const handleMatch = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/action/matchbet`,
        {
          gameName: roomName,
          playerName: playerName,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.status !== 200) {
        toast.error(res.data.message || "An error occurred");
      } else {
        toast.success("Action performed successfully!");
        setGameDetails(res.data);
        setPlayers(res.data.players);
        socket.emit("updateRoom", {message: `${playerName} has matched the bet`, roomId: gameDetails._id});
      }
    } catch (error) {
      toast.error(JSON.parse(error?.request?.response)?.message || "Failed to perform action");
    }
  };

  const handleVoteForWinner = async (pl) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/action/callwinner`,
        {
          gameName: roomName,
          playerName,
          winnerName: votedPlayer,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        if(pl === "None"){
            toast.success("");
        }
        else{
            toast.success("Vote casted successfully!");
        }
        setIsVotingModalOpen(false);
        setGameDetails(res.data);
        setPlayers(res.data.players);
            socket.emit("refreshRoom", {roomId: gameDetails._id});
      } else {
        toast.error(res.data.message || "Failed to cast vote.");
      }
    } catch (error) {
      toast.error(
        JSON.parse(error?.request?.response)?.message || "Error casting vote."
      );
    }
  };

  const handleConfirmAction = async () => {
    const player = players.find((p) => p.name === playerName);
    const maxRaiseAmount = Math.max(
      0,
      (player?.amount || 0) - (gameDetails.currentBet || 0)
    );

    if (!player) {
      toast.error("Player not found in this room.");
      return;
    }

    if (
      (actionType === "raise" && selectedAmount > maxRaiseAmount) ||
      (actionType === "placebet" && selectedAmount > player.amount)
    ) {
      toast.error("Insufficient funds for the selected amount.");
      return;
    }

    try {
      const endpoint = `http://localhost:3000/action/${actionType}`;
      const payload = {
        gameName: roomName,
        playerName,
        ...(actionType === "placebet"
          ? { betAmount: selectedAmount }
          : { raise: selectedAmount }),
      };

      const res = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.status === 200) {
        toast.success("Action performed successfully!");
        setGameDetails(res.data);
        setPlayers(res.data.players);
        if(actionType === "placebet")
            socket.emit("updateRoom", {message: `${playerName} has placed a bet of $${selectedAmount}`, roomId: gameDetails._id});
        else
            socket.emit("updateRoom", {message: `${playerName} has raised the bet by $${selectedAmount}`, roomId: gameDetails._id});
      } else {
        toast.error(res.data.message || "An error occurred");
      }
    } catch (error) {
      console.error("Failed to perform action:", error);
      toast.error(
        JSON.parse(error?.request?.response)?.message || "Failed to perform action"
      );
    }

    setIsModalOpen(false);
  };

  const nextRound = async () => {
    if (gameDetails.currentRoundWinner === "") {
      toast.error("Please select a winner for this round.");
      return;
    }
    try {
        const res = await axios.post("http://localhost:3000/action/declarewinner",{
            gameName: roomName,
        },{
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        })
        if (res.status === 200) {
            toast.success("Round ended successfully.");
            setGameDetails(res.data);
            setPlayers(res.data.players);
            socket.emit("updateRoom", {
              message: "Round ended",
              roomId: gameDetails._id,
            });
        }
        else{
            toast.error(res.data.message || "Failed to end round")
        }

    } catch (error) {
      console.error("Error starting next round:", error);
      toast.error(
        JSON.parse(error?.request?.response)?.message ||
          "Failed to start next round"
      );        
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 md:flex items-center justify-center p-4 gap-4">
      <div className="mb-4">
        {/* Voting Popup */}
        {showVotePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold text-center mb-4">
                Do you accept {gameDetails.currentRoundWinner} as the winner of
                this round?
              </h2>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => handleVote(true)}
                  className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleVote(false)}
                  className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          <Logo />

          {/* Room Info */}
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Room Name: <span className="text-blue-400">{roomName}</span>
          </h1>
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-700">
              Room Password: <span className="font-medium">{roomPassword}</span>
            </p>
          </div>
          <div className="mb-6 flex justify-center gap-16">
            <p className="text-md font-semibold text-gray-700">
              Current Bet: ${gameDetails.currentBet || 0}
            </p>
            <p className="text-md font-semibold text-gray-700">
              Pot: ${gameDetails.pot || 0}
            </p>
          </div>

          {/* Player List */}
          <h2 className="text-xl text-center font-semibold text-gray-800 mb-4">
            Players
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {players.length > 0 ? (
              players.map((player) => (
                <div
                  key={player._id}
                  className="bg-indigo-50 p-4 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-800">
                      {player.name}
                      {player.name === playerName && (
                        <span className="text-green-500 text-sm ml-2">
                          (You)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      Amount: ${player.amount}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No players yet.</p>
            )}
          </div>

          {/* Betting Controls */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => handleOpenModal("placebet")}
              disabled={gameDetails.currentBet > 0} // Disable if currentBet is not zero
              className={`py-2 px-4 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white ${
                gameDetails.currentBet > 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              Place Bet
            </button>
            <button
              onClick={() => handleOpenModal("raise")}
              disabled={!gameDetails.currentBet}
              className={`py-2 px-4 rounded-lg font-medium text-white ${
                !gameDetails.currentBet
                  ? "cursor-not-allowed bg-yellow-400"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              Raise
            </button>
            <button
              onClick={() => handleMatch()}
              disabled={!gameDetails.currentBet}
              className={`py-2 px-4 rounded-lg font-medium text-white ${
                !gameDetails.currentBet
                  ? "cursor-not-allowed bg-green-400"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              Match
            </button>
          </div>

          {/* Vote for Winner Button */}
          <div className="mt-6 flex justify-center gap-8">
            <button
              onClick={() => setIsVotingModalOpen(true)}
              className="py-2  px-4 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
            >
              Select Round Winner
            </button>
            <button
              onClick={() => nextRound()}
              className="py-2  px-4 rounded-lg bg-gray-800 text-white hover:bg-gray-400"
            >
              Next Round
            </button>
          </div>
        </div>

        {/* Modal for Vote for Winner */}
        {isVotingModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-80">
              <h2 className="text-xl font-bold mb-4 text-center">
                Select Round Winner
              </h2>
              <div className="mb-4">
                <p className="text-center text-sm text-gray-700">
                  Select a player to vote for as the winner.
                </p>
                <select
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  onChange={(e) => setVotedPlayer(e.target.value)}
                >
                  <option value="">None</option>
                  {players.map((player) => (
                    <option key={player._id} value={player.name}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setIsVotingModalOpen(false)}
                  className="py-2 px-4 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVoteForWinner}
                  className="py-2 px-4 rounded-lg bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Vote
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Bet/Raise Amount */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-80">
              <h2 className="text-xl font-bold mb-4 text-center">
                {actionType === "placebet" ? "Place Bet" : "Raise Amount"}
              </h2>
              <input
                type="range"
                min="1"
                max={
                  actionType === "raise"
                    ? Math.max(
                        0,
                        (players.find((p) => p.name === playerName)?.amount ||
                          0) - (gameDetails.currentBet || 0)
                      )
                    : players.find((p) => p.name === playerName)?.amount || 1
                }
                value={selectedAmount}
                onChange={handleSliderChange}
                className="w-full slider"
              />
              <p className="text-center mt-2">Amount: ${selectedAmount}</p>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className="py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="md:w-1/3 min-h-screen ">
          <img
            src="/hand_rank.jpg"
            alt="Poker Hand Rankings"
            className="rounded-lg shadow-lg object-contain"
          />
      </div>
    </div>
  );
};

export default Room;
