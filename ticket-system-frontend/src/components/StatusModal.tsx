import { ChangeEvent, useEffect, useState } from "react";
import { Modal } from 'bootstrap';
import { Status } from "../models/Ticket";
import backendApi from "../services/BackendApi";

export default function StatusModal({ selectedTicket, showModal, setShowModal, updateTicketStatus }: any) {
    const [statusList, setStatusList] = useState<Status[]>([]);
    const [status, setStatus] = useState<string>("");
    const [comment, setComment] = useState<string>("");
    const [modal, setModal] = useState<Modal>();

    useEffect(() => {
        const element = document.getElementById("status-action-modal") as Element;
        if (typeof element !== "undefined") {
            let modal = new Modal(element, { "backdrop": "static" });
            setModal(modal);
        }
    }, []);

    useEffect(() => {
        const abortController = new AbortController();

        backendApi.get('/statuses/', abortController.signal)
            .then(json => setStatusList(json));

        return () => {
            abortController.abort();
        };
    }, []);

    useEffect(() => {
        showModal ? modal?.show() : modal?.hide();
    }, [showModal, modal]);

    const updateStatus = () => {
        if (status && comment){
            backendApi.patch(`/tickets/${selectedTicket?.id}/update_status/`, { status : status, comment : comment })
            .then(json => {
                if (json && json.status === status){
                    const statusText = statusList.find(x => x.id === status)?.text || status;
                    updateTicketStatus(selectedTicket?.id, statusText);
                    setShowModal(false);
                    setStatus("");
                    setComment("");
                }
            });            
        }        
    };

    const handleSelect = (event: ChangeEvent) => {
        const target = event.target as HTMLSelectElement;
        setStatus(target.value);
    };

    const handleTextArea = (event: ChangeEvent) => {
        const target = event.target as HTMLTextAreaElement;
        setComment(target.value);
    };

    return (
        <div className="modal fade" id="status-action-modal" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update Status for ticket #{selectedTicket?.id}</h5>
                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        <p>Current Status: <b>{selectedTicket?.status}</b></p>
                        <p>Description: {selectedTicket?.description}</p>
                        <hr />
                        <div className="form-group mb-3">
                            <label className="form-label">New Status</label>
                            <select className="form-select" value={status} onChange={handleSelect}>
                                <option value="">Select...</option>
                                {statusList.filter(f => f.text !== selectedTicket?.status).map((status: Status) => <option key={status.id} value={status.id}>{status.text}</option>)}
                            </select>
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">Comment</label>
                            <textarea className="form-control" value={comment} onChange={handleTextArea}></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={updateStatus}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};