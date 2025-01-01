import Logo from "../components/Logo";
import RoomForm from "../components/RoomForm";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <Logo />

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Join the <div className="text-blue-400 inline-block">PCM</div>
        </h1>

        <RoomForm />
      </div>
    </div>
  );
}

export default HomePage
