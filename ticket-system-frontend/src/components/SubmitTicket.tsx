import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NewTicket } from "../models/Ticket";
import BackendApi from "../services/BackendApi";
import "./SubmitTicket.css";


function getEmptyTicket(){
    return {
        title : "", 
        description : "", 
        level : ""
    };
};

export default function SubmitTicket() {
    const [ticket, setTicket] = useState<NewTicket>(getEmptyTicket);
    const [focus, setFocus] = useState<string>("title");
    const [validations, setValidations] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    function handleInput(event : ChangeEvent){
        const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const newState = {...ticket, [target.id] : target.value };
        setTicket(newState);
        setValidations(validations.filter(v => v !== target.id));
    };

    function sendTicket(){
        let errors = [];
        for (let prop in ticket){
            if (!ticket[prop]){
                errors.push(prop);
            }
        }

        if (errors.length){
            setValidations(errors);
            setFocus(errors[0]);
            return;
        }

        BackendApi.post("/tickets/", ticket).then((json) => {
            if (json.detail){
                setMessage(json.detail);
                return;
            }

            setMessage("");            
            setTicket(getEmptyTicket());
            setFocus("title");  
            navigate("/ticket-list");
        });              
    }

    useEffect(() => {
        if (focus){
            document.getElementById(focus)?.focus();
        }
        setFocus("");        
    }, [focus]);


    return (
        <div className="submit-ticket row">
            <h2>Submit a ticket</h2>
            <div className="form-group col-md-2 mt-3">
                <label htmlFor="">Level</label>
                <select className="form-select" id="level" value={ticket.level} onChange={handleInput}>
                    <option value="">Select Level</option>
                    <option value="critical">Critical</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                {validations.includes("level") && <span className="text-danger">Please select a level</span>}
            </div>

            <div className="form-group col-md-6 mt-3">
                <label htmlFor="">Title</label>
                <input className="form-control" id="title" value={ticket.title} onChange={handleInput}  />
                {validations.includes("title") && <span className="text-danger">Please specify a valid title</span>}
            </div>
            
            <div className="form-group col-md-8 mt-3">
                <label htmlFor="">Description</label>
                <textarea className="form-control" id="description" value={ticket.description} onChange={handleInput} rows={4}></textarea>
                {validations.includes("description") && <span className="text-danger">Please specify a valid description</span>}
            </div>
            
            <div className="buttons">
                <button className="btn btn-primary me-2" onClick={sendTicket}>Send</button>
                <button className="btn btn-secondary" onClick={() => navigate("/ticket-list")}>Cancel</button>
            </div>
            {message ? <p className="alert alert-danger mt-3 w-50">{message}</p> : null }
        </div>
    );
};