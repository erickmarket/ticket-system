export type Ticket = {
    id : number;
    title : string;
    description: string;
    level: string;
    creation_date : string;
    mod_date: string;
    status: string;
    user: string;
    [index: string] : string | number;
};

export type NewTicket = {
    title : string;
    description: string;
    level: string;
    [index: string] : string;
};

export type Status = {
    id : string;
    text : string;
}

export type StatusLog = {
    id : number;
    ticket : number;
    status : string;
    creation_date : Date;
    user : string;
    comment : string;
};