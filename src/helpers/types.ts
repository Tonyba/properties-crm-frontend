import type { RouteObject } from "react-router";


export type Lead = {
    id: number;
    first_name: string;
    last_name: string;
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
    requested_property?: string;
}

export type Agent = {
    name: string;
    id: number;
}

export type ListLeadRequest = {
    filters: Lead;
    page?: number;
    perPage: number;
}

export type SingleLeadResponse = {
    lead: Lead;
    ok: boolean;
}

export type GetLeadsResponse = {
    data: Lead[],
    draw: number,
    recordsFiltered: number,
    recordsTotal: number,
}

export type CreateLeadRequest = {
    msg: string;
    ok: boolean
}

export type ModuleHeaderPropsType = {
    moduleSingle?: string;
    createPath?: string;
    importBtn?: boolean;
    filter?: boolean;
    isCreate?: boolean;
    showCreateBtn?: boolean;
}

export type RouterItem = RouteObject & {
    label?: string;
    index?: boolean;
    children?: RouterItem[];
    headerProps?: ModuleHeaderPropsType
    createPath?: boolean
}

export type IsNever<T> = [T] extends [never] ? true : false;

export type InputItem = {
    label: string;
    key: string;
    type: 'text' | 'select' | 'number' | 'checkbox' | 'radio' | 'textarea' | 'tel' | 'email';
    value?: string | string[];
    required?: boolean;
    isMultiSelect?: boolean;
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

export type SearchPropertyByNameResponse = {
    title: string;
    id: number;
}[];