
export type Lead = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    assigned_to: string;
    secondary_emai?: string;
    email_opt_out?: boolean;
    industry?: string;
    status?: string;
    phone?: string;
    mobile?: string;
    website?: string;
    description?: string;
    source?: string;
}

export type FilterItem = {
    label: string;
    key: string;
    type: string;
    value?: string | string[];
}