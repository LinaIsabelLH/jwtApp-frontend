import reactLogo from "../assets/react.svg";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/token/",
        { email, password },
        { withCredentials: true }  //Permet d'envoyer le refresh token gardé dans un cookie HttpOnly
      );

      sessionStorage.setItem("access", res.data.access);
      navigate("/")  //login OK, redirection Dashboard
    } catch (err) {
      alert("Erreur de connexion: " + err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-sky-100 to-sky-300 p-4">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src={reactLogo} className="h-16 w-16" alt="React logo" />
        </div>

        <h2 className="text-2xl font-bold text-center text-sky-700 mb-6">
          Se connecter
        </h2>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sky-700">Email</label>
            <input
              type="email"
              placeholder="email@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-sky-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1 text-sky-700">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-sky-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <button
            onClick={handleLogin}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 rounded-2xl shadow-md transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
