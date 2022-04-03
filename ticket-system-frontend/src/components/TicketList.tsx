import { useEffect, useState } from "react";

import { Ticket } from "../models/Ticket";
import backendApi from "../services/BackendApi";
import StatusLogModal from "./StatusLogModal";
import StatusModal from "./StatusModal";
import "./TicketList.css";

export default function TicketList() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    
    const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
    const [showLogModal, setShowLogModal] = useState<boolean>(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket>();

    useEffect(() => {
        const abortController = new AbortController();

        backendApi.get('/tickets/',abortController.signal)
            .then(json => setTickets(json));

        return () => {
            abortController.abort();
        };
    }, []);    

    const statusModalAction = (ticket: Ticket) => {
        setShowLogModal(false);

        setSelectedTicket(ticket);
        setShowStatusModal(true);
    };

    const logModalAction = (ticket: Ticket) => {
        setShowStatusModal(false);

        setSelectedTicket(ticket);
        setShowLogModal(true);
    };

    const updateTicketStatus = (id: number, status: string) => {
        setTickets(tickets.map(t => t.id === selectedTicket?.id ? {...t, status : status} : t));
    }
    
    return (
        <div className="ticket-list row">
            <h2>Ticket List</h2>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Level</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th className="d-none d-md-table-cell">User</th>
                            <th className="d-none d-md-table-cell">Date</th>
                            <th className="w-md-25">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket.id}>
                                <td>{ticket.level}</td>
                                <td>{ticket.title}</td>
                                <td>{ticket.status}</td>
                                <td className="d-none d-md-table-cell">{ticket.user}</td>
                                <td className="d-none d-md-table-cell">{new Date(ticket.creation_date).toLocaleDateString()}</td>
                                <td>
                                    <button className="btn btn-danger me-1" onClick={() => statusModalAction(ticket)}>
                                        <span className="d-md-none">S</span>
                                        <span className="d-none d-md-inline">Status</span>
                                    </button>
                                    <button className="btn btn-success" onClick={() => logModalAction(ticket)}>
                                        <span className="d-md-none">L</span>
                                        <span className="d-none d-md-inline">View Log</span>
                                    </button>
                                </td>
                            </tr>))}
                    </tbody>
                </table>
            </div>
            <StatusModal selectedTicket={selectedTicket} showModal={showStatusModal} 
                setShowModal={setShowStatusModal} updateTicketStatus={updateTicketStatus} />

            <StatusLogModal selectedTicket={selectedTicket} showModal={showLogModal} 
                setShowModal={setShowLogModal} />

        </div>);
};