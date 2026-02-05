import axios from "axios";

 // axios.create : crée ton API
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  withCredentials: true,
});

// request interceptor :  ajoute le token
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor : gère expiration 
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const res = await axios.post(   //refresh : récupère nouveau token
          "http://127.0.0.1:8000/api/auth/token/refresh/",
          {},
          { withCredentials: true }
        );
        sessionStorage.setItem("access", res.data.access);
        error.config.headers.Authorization = "Bearer " + res.data.access;  //relance requête, invisible pour l'user
        return axios(error.config);
      } catch {
        sessionStorage.removeItem("access");   //échec refresh : logout automatique
        window.location = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;