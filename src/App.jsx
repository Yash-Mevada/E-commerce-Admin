import { RouterProvider } from "react-router-dom";
import router from "@/router/router.tsx";
import "./App.css";
function App() {
  return <RouterProvider router={router} />;
}

export default App;
