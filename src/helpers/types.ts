import type { RouteObject } from "react-router";

export type Update = {
    id: number;
    date: string;
    new_data?: string;
    old_data?: string;
    affected?: string;
    user: string;
    action: 'Edited' | 'Created' | 'Contact	Converted to Contact' | 'Trashed' | 'Linked';
}

export type Task = {
    assigned_to: string;
    relation?: number;
    contact?: number;
    from: string;
    to: string;
    description?: string;
}

export type Event = {
    title: string;
    from: string;
    to: string;
    status: string;
    assigned_to: string;
    priority?: string;
    contact?: string;
    relation?: number,
    description?: string;
}

export type BoxData<T> = {
    data?: T[]
}

export type Document = {
    id: number;
    title: string;
    download_type: string;
    external_url?: string;
    assigned_to: string;
    relation?: number;
    note?: string;
    file?: string;
    ext?: string
    filename?: string
    file_id: number;
}

export type OffcanvasProps = {
    open?: boolean,
    title?: string,
    template?: string,
    size?: 'sm' | 'xl',
    customOpts?: OffcanvasCustomOpts
}

export type OffcanvasCustomOpts = {
    external: boolean
}

export type GenericResponse = {
    ok: boolean;
    msg?: string;
}

export type DocumentCreationResponse = {
    file: string
} & GenericResponse;

export type GetUpdateResponseType = {
    data?: Update[]
} & GenericResponse;

export type TaxonomiesArr = {
    [key: string]: SelectOption[]
};

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
    label?: string;
    key: string;
    type: 'text' | 'select' | 'number' | 'checkbox' | 'radio' | 'textarea' | 'tel' | 'email' | 'upload' | 'hidden';
    value?: string | string[];
    required?: boolean;
    isMultiSelect?: boolean;
    options?: SelectOption[];
    valid_ext?: string[];
    placeholder?: string;
    isClearable?: boolean;
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
