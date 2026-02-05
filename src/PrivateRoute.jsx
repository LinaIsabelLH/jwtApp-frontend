import {Navigate} from "react-router-dom";

// Si le Token est présent, le Dashboard est affiché, sinon Redirection vers login
function PrivateRoute({children}){
    const token = sessionStorage.getItem("access");
    return token ? children : <Navigate to="/login"/>;
}

export default PrivateRoute; 