export type Intervenant = {
    id: number;
    firstname: string;
    lastname: string;
    key: string;
    email: string;
    creationdate: Date;
    enddate: Date;
    availability: {};
    modifieddate: Date;
};

export type Intervenants = Intervenant[];