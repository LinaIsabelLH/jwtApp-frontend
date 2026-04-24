import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  withCredentials: true,
});

// Ajoute automatiquement l'access token sur chaque requête
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Gère automatiquement l'expiration de l'access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    // Si c'était une requête refresh qui avait échoué, on coupe tout sans reessayer
    if (originalRequest?.url?.includes("auth/token/refresh/")) {
      sessionStorage.removeItem("access");
      window.location = "/login";
      return Promise.reject(error);
    }

    // Si on reçoit 401 et qu'on n'a pas encore tenté le refresh 
    // Pour éviter une boucle infinite
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        //refresh : récupère nouvel access token
        const res = await api.post("auth/token/refresh/"); 

        sessionStorage.setItem("access", res.data.access);

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;

        // Rejoue la requête initiale avec la même instance Axios
        return api(originalRequest);
      } catch (refreshError) {
        sessionStorage.removeItem("access");
        window.location = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;