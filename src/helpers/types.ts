import type { RouteObject } from "react-router";


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

export type ModuleHeaderPropsType = {
    moduleSingle?: string;
    createPath?: string;
    importBtn?: boolean;
    filter?: boolean;
    isCreate?: boolean
}

export type RouterItem = RouteObject & {
    label?: string;
    index?: boolean;
    children?: RouterItem[];
    headerProps?: ModuleHeaderPropsType
}


export type InputItem = {
    label: string;
    key: string;
    type: 'text' | 'select' | 'number' | 'checkbox' | 'radio' | 'textarea' | 'tel' | 'email';
    value?: string | string[];
    required?: boolean;
    options?: SelectOption[]
}

export type SelectOption = {
    value: string;
    label: string;
}

export type Term = {
    term_id: number,
    name: string,
    slug: string
}


export type AddSelectsResponse = {
    industry: Term[],
    lead_source: Term[],
    lead_status: Term[]
}