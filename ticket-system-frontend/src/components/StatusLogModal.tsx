import { useEffect, useState } from "react";
import { Modal } from 'bootstrap';
import { StatusLog } from "../models/Ticket";
import backendApi from "../services/BackendApi";

export default function StatusModal({ selectedTicket, showModal, setShowModal }: any) {
    const [statusLogList, setStatusLogList] = useState<StatusLog[]>([]);
    const [modal, setModal] = useState<Modal>();

    useEffect(() => {
        const element = document.getElementById("status-log-action-modal") as Element;
        if (typeof element !== "undefined") {
            let modal = new Modal(element, { "backdrop": "static" });
            setModal(modal);
        }
    }, []);

    useEffect(() => {
        if (!selectedTicket){
            setStatusLogList([]);
            return;
        }
        
        const abortController = new AbortController();

        backendApi.get(`/tickets/${selectedTicket?.id}/get_status_logs/`, abortController.signal)
            .then(json => json && setStatusLogList(json));

        return () => {
            abortController.abort();
        };
    }, [selectedTicket]);

    useEffect(() => {
        showModal ? modal?.show() : modal?.hide();
    }, [showModal, modal]);

    return (
        <div className="modal fade" id="status-log-action-modal" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Status Logs for ticket #{selectedTicket?.id}</h5>
                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <td className="d-none d-md-table-cell">User</td>
                                    <td>Status</td>
                                    <td>Comment</td>
                                    <td>Date</td>
                                </tr>
                            </thead>
                            <tbody>
                                {statusLogList.map(log =>
                                    <tr key={log.id}>
                                        <td className="d-none d-md-table-cell">{log.user}</td>
                                        <td>{log.status}</td>
                                        <td>{log.comment}</td>
                                        <td>{new Date(log.creation_date).toLocaleString()}</td>
                                    </tr>
                                )}
                                {statusLogList.length <= 0 && <tr><td colSpan={4}>No logs available yet.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};