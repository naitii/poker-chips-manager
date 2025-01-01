import JoinRoom from "./pages/JoinRoom.jsx";
import CreateRoom from "./pages/CreateRoom.jsx";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import HomePage from './pages/HomePage';
import Room from './pages/Room';
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/join",
    element: <JoinRoom />,
  },
  {
    path: "/create",
    element: <CreateRoom />,
  },
  {
    path: "/room/:roomId",
    element: <Room />,
  }
]);

function App() {
  return (
    <>
        <RouterProvider router={router}/>
        <Toaster />
    </>
  );
}

export default App;