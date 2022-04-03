import React, { ChangeEvent, KeyboardEvent, useContext, useEffect, useState } from "react";
import { AuthContext, ILoginData } from "../contexts/AuthProvider";
import "./Login.css";


export default function Login() {
    const [loginUser, setLoginUser] = useState<ILoginData>({
        username : localStorage.getItem("_username") || "", 
        password : "" 
    });

    const [focus, setFocus] = useState<string>("username");
    const [validations, setValidations] = useState<string[]>([]);
    const {login, loginMessage, clearLoginMessage} = useContext(AuthContext);
    const [disableUI, setDisableUI] = useState<boolean>(false);

    function handleInput(event : ChangeEvent){
        const target = event.target as HTMLInputElement;
        const newState = {...loginUser, [target.id] : target.value };
        setLoginUser(newState);
        setValidations(validations.filter(v => v !== target.id));
    };

    function handleEnter(event : KeyboardEvent){
        if (event.key === "Enter"){
            const target = event.target as HTMLInputElement;

            switch(target.id){
                case "username":
                    setFocus("password");
                    break;
                case "password":
                    send();
                    break;
            }
        }
    };

    function send(){
        let errors = [];
        for (let prop in loginUser){
            if (!loginUser[prop]){
                errors.push(prop);
            }
        }

        if (errors.length){
            setValidations(errors);
            setFocus(errors[0]);
            return;
        }

        setDisableUI(true);
        clearLoginMessage();
        login(loginUser);
    }

    useEffect(() => {
        if (focus){
            document.getElementById(focus)?.focus();
        }
        setFocus("");        
    }, [focus]);

    useEffect(() => {
        if (loginMessage){
            setDisableUI(false);
        }      
    }, [loginMessage]);

    return (
        <div className="login-form">
            <h2>Login</h2>
            <div className="form-group col-md-8 mt-3">
                <label htmlFor="">Username</label>
                <input className="form-control" id="username" value={loginUser.username} 
                onChange={handleInput} onKeyDown={handleEnter} disabled={disableUI} />
                {validations.includes("username") && <span className="text-danger">Please specify a valid username</span>}
            </div>
            <div className="form-group col-md-8 mt-3">
                <label htmlFor="">Password</label>
                <input className="form-control" id="password" type="password" value={loginUser.password} 
                onChange={handleInput} onKeyDown={handleEnter} disabled={disableUI} />
                {validations.includes("password") && <span className="text-danger">Please specify a valid password</span>}
            </div>
            <div className="buttons">
                <button className="btn btn-outline-light me-2" onClick={send} disabled={disableUI}>Log In</button>
            </div>
            { loginMessage ? <p className="alert alert-light mt-5 w-75">{loginMessage}</p> : null }
        </div>
    );
};