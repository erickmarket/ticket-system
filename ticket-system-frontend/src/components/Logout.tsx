import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

export default function Logout() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate("/");
    });

    return (
        <div className="border px-5 py-3 border-primary col-md-6">
            <h2>Logging out...</h2>
        </div>
    );
};