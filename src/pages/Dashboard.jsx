import { useState } from "react";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const token = sessionStorage.getItem("access");
  const user = jwtDecode(token);

  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();


  const callApi = async (url) => {
    try {
      const res = await api.get(url);
      console.log(res.data.message);
      setMessage(res.data.message);
    } catch (err) {
      console.log(err.response?.data || "Erreur");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("access");
    setMessage(""),
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-100 to-sky-300 p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-sky-700 mb-2 mt-5">
        Bienvenu(e) à votre Dashboard
      </h1>
      <p className="text-lg font-medium text-sky-600 my-10">
        Account tier : {user.account_tier}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 w-full max-w-md">
        <button
          onClick={() => callApi("me/")}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-2xl shadow-md transition-colors"
        >
          Profil
        </button>
        <button
          onClick={() => callApi("admin/panel/")}
          className={`py-3 font-bold rounded-2xl shadow-md transition-colors ${
            user.is_staff
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!user.is_staff}
        >
          Panel admin
        </button>
        <button
          onClick={() => callApi("premium-data/")}
          className={`py-3 font-bold rounded-2xl shadow-md transition-colors ${
            user.account_tier === "FREE"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          disabled={user.account_tier === "FREE"}
        >
          Accès PREMIUM ou UNLIMITED
        </button>
      </div>
      <p className="my-20">
        <span className="font-bold">Message : </span> {message}{" "}
      </p>
      <button
        onClick={() => logout()}
        className="bg-sky-950 hover:bg-sky-900 text-white font-bold py-3 px-10 rounded-2xl shadow-md transition-colors"
      >
        Déconnexion
      </button>
    </div>
  );
}

export default Dashboard;
