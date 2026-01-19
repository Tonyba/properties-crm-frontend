import type { RouteObject } from "react-router";
import type { ActionOptType } from "../components/SummaryBoxComponents/SummaryBox";
import type { DateValue, RangeValue } from "react-aria";
import type dayjs from "dayjs";
import type { KanbanBoardCircleColor } from "@/components/kanban";

export type SingleModuleMoreBtnActionType = {
    fn: () => void,
    label: string,
    isDivider?: boolean
}

export type Update = {
    id: number;
    date: string;
    new_data?: string;
    old_data?: string;
    affected?: string;
    user: string;
    action: 'Edited' | 'Created' | 'Contact	Converted to Contact' | 'Trashed' | 'Linked';
}

export type SummaryBoxAction = {
    action: string,
    isWithSelect?: boolean,
    action_fn?: Function,
    options?: ActionOptType[]
}

export type WithDataId = {
    data: number;
}

export type Task = {
    assigned_to: string;
    relation?: number;
    contact?: number;
    from: string | Date | dayjs.Dayjs;
    to: string | Date | dayjs.Dayjs;
    description?: string;
    event_status: string;
    priority?: string;
    title: string;
    id: number
}

export type Event = {
    id: number;
    title: string;
    from: string | Date | dayjs.Dayjs;
    to: string | Date | dayjs.Dayjs;
    event_status: string;
    assigned_to: string;
    priority?: string;
    contact?: string;
    relation?: number,
    description?: string;
    event_type: string
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

export type Activities = {
    post_type: 'task' | 'event'
    date: string;
    title: string;
    id: number;
    status: string;
    relation?: number;
    from: string;
    to: string;
}

export type GenericResponse = {
    ok: boolean;
    msg?: string;
    data: any
}

export type QuickCreationProps = {
    getSingleFn: (id: string, updating?: boolean) => Promise<any>
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

export type Card = {
    id: string;
    title: string;
};

export type Column<T> = {
    id: string;
    title: string;
    color: KanbanBoardCircleColor;
    items: T[];
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

export type Service = {
    id: number;
    title: string;
}

export type Agent = {
    name: string;
    id: number;
}

export type ListLeadRequest<T> = {
    filters: T;
    page?: number;
    perPage: number;
}

export type SingleLeadResponse = {
    lead: Lead;
    ok: boolean;
}

export type GetSingleResponse<T> = {
    data: T;
    ok: boolean;
}

export type GetLeadsResponse<T> = {
    data: T[],
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
    showViewSwitcher?: boolean;
}

export type RouterItem = RouteObject & {
    label?: string;
    index?: boolean;
    children?: RouterItem[];
    headerProps?: ModuleHeaderPropsType
    createPath?: boolean
}

export type IsNever<T> = [T] extends [never] ? true : false;

export type InputRangeDate = {
    start: DateValue | Date;
    end: DateValue | Date,
}

export type InputItem = {
    label?: string;
    key: string;
    type: 'text' | 'datetimepicker' | 'section' | 'select' | 'number' | 'checkbox' | 'radio' | 'textarea' | 'tel' | 'email' | 'upload' | 'hidden';
    value?: string | string[] | InputRangeDate | DateValue;
    isSingleDate?: boolean;
    required?: boolean;
    isMultiSelect?: boolean;
    options?: SelectOption[];
    valid_ext?: string[];
    placeholder?: string;
    isClearable?: boolean;
    quickField?: boolean;
    isRelationField?: boolean;
    isFilterField?: boolean;
    children?: InputItem[];
    isAsyncSelect?: boolean;
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


export type Contact = {
    id: string | number;
    first_name: string;
    last_name: string;
    office_phone: string;
    mobile: string;
    email: string;
    secondary_email: string;
    lead_source: number | string;
    birthdate: string;
    email_opt_out: boolean;
    not_call: boolean;
    assigned_to: number | string;
    mailing_street?: string;
    mailing_city?: string;
    mailing_state?: string;
    mailing_country?: string;
    mailing_zip?: string
    description?: string
}

export type Opportunity = {
    id: string | number;
    title: string;
    contact: number[] | string[] | SelectOption[];
    assigned_to: number | string;
    lead_source: number | string;
    lead_status: number | string;
    close_date?: string | Date | DateValue | RangeValue<DateValue> | dayjs.Dayjs;
    description?: string;
    country?: string;
    state?: string;
    city?: string;
    related_services?: string[] | SelectOption[]
}

export type QuickOffCanvasProps = {
    handleClose: () => void;
}