import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackendApi from "../services/BackendApi";

export interface IUser {
    username: string;
    token?: string;
    is_staff? : boolean;
};

export interface ILoginData {
    username: string;
    password: string;
    [index: string]: string;
};

export interface IAuthModel {
    user: IUser;
    isLoggedIn: boolean;
    login: (data: ILoginData) => void;
    logout: () => void;
    loginMessage: string;
    clearLoginMessage: () => void;
}

const defaultAuthContext = {} as IAuthModel;

export const AuthContext = React.createContext(defaultAuthContext);

export default function AuthProvider(props: any) {
    const [user, setUser] = useState<IUser>(() => {
        return {
            username: localStorage.getItem("_username") || "",
            token: localStorage.getItem("_token") || undefined,
            is_staff : Boolean(localStorage.getItem("_is_staff")) || undefined
        };
    });
    const [loginMessage, setLoginMessage] = useState<string>("");

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = !!user.token;
        const isLoginPage = location.pathname.indexOf("/login") >= 0;
        const isHomePage = location.pathname === "/";

        if (isLoggedIn && (isLoginPage || isHomePage)) {
            navigate("/ticket-list");
            return;
        }

        if (!isLoggedIn && !isLoginPage) {
            navigate("/login");
            return;
        }

    }, [user, location.pathname, navigate]);

    function login(loginData: ILoginData) {
        BackendApi.post("/auth-token/", loginData)
            .then(json => {
                if (json && json.token) {
                    localStorage.setItem("_username", json.username);
                    localStorage.setItem("_token", json.token);
                    localStorage.setItem("_is_staff", json.is_staff);

                    setUser(json);
                    setLoginMessage("");
                    return;
                }

                if (json && json.non_field_errors && json.non_field_errors.length) {
                    setLoginMessage(json.non_field_errors[0]);
                    return;
                }

                setLoginMessage("An error has occurred. Please try again later.");
            });
    };

    function logout() {
        setUser({ username: "" });
        localStorage.removeItem("_token");
    };

    const obj = {
        user: user,
        isLoggedIn: !!user.token,
        login: login,
        logout: logout,
        loginMessage: loginMessage,
        clearLoginMessage: () => setLoginMessage("")
    };

    return (
        <AuthContext.Provider value={obj}>
            {props.children}
        </AuthContext.Provider>
    );
};