import { FaUser } from "react-icons/fa";
import type { InputItem, OffcanvasProps } from "./types";
import { megabytesToBytes } from "./helpers";

export const API_URL = 'http://properties-crm.local/wp-admin/admin-ajax.php';

export const headerHeight = 72;
export const iconSize = 20

export const DateFormat = 'D/M/YYYY HH:MM';

export const RelatedTypes = ['lead', 'task', 'event', 'document', 'property'];

export const ValidExt = ['jpg', 'png', 'pdf', 'jpeg', 'webp'];
export const validSizeInMB = megabytesToBytes(5);

export const contactIcon = <FaUser size={iconSize} />

export const DefaultOffcanvasOpts: OffcanvasProps = {
    open: false,
    title: '',
    template: '',
    customOpts: {
        external: false
    }
}

export const TaskFormFields: InputItem[] = [
    {
        key: 'title',
        label: 'Subject',
        type: 'text',
        required: true,
        quickField: true
    },
    {
        key: 'from',
        label: 'From',
        type: 'datetimepicker',
        required: true,
        quickField: true
    },
    {
        key: 'to',
        label: 'To',
        type: 'datetimepicker',
        required: true,
        quickField: true
    },
    {
        key: 'description',
        label: 'Description',
        type: 'textarea'
    },
    {
        key: 'assigned_to',
        label: 'Assigned To',
        type: 'select',
        quickField: true,
        required: true
    },
    {
        key: 'priority',
        label: 'Priority',
        type: 'select'
    },
    {
        key: 'event_status',
        label: 'Status',
        type: 'select',
        quickField: true,
        required: true,
        isClearable: false
    }
];

export const EventFormFields: InputItem[] = [
    {
        key: 'title',
        label: 'Subject',
        type: 'text',
        required: true,
        quickField: true
    },
    {
        key: 'from',
        label: 'From',
        type: 'datetimepicker',
        required: true,
        quickField: true
    },
    {
        key: 'to',
        label: 'To',
        type: 'datetimepicker',
        required: true,
        quickField: true
    },
    {
        key: 'description',
        label: 'Description',
        type: 'textarea'
    },
    {
        key: 'assigned_to',
        label: 'Assigned To',
        type: 'select',
        quickField: true,
        required: true
    },
    {
        key: 'event_type',
        label: 'Activity Type',
        type: 'select',
        required: true,
        quickField: true
    },
    {
        key: 'event_status',
        label: 'Status',
        type: 'select',
        quickField: true,
        required: true,
        isClearable: false
    }
];

export const DocumentUploadFormFields: InputItem[] = [
    {
        key: 'uploaded_file',
        type: 'upload',
        quickField: true
    },
    {
        key: 'external_url',
        type: 'text',
        label: 'File Url',
        required: true,
        quickField: true
    },
    {
        key: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        quickField: true,
        isFilterField: true
    },
    {
        key: 'assigned_to',
        label: 'Assigned to',
        type: 'select',
        required: true,
        isClearable: false,
        quickField: true,
        isFilterField: true
    },
    {
        key: 'note',
        label: 'Note',
        type: 'textarea',
        quickField: true
    },
    {
        key: 'download_type',
        label: 'Download Type',
        type: 'select',
        isClearable: false,
        quickField: true
    },
    {
        key: 'relation',
        label: 'Relation',
        type: 'hidden',
        quickField: true
    }
];

export const leadFields: InputItem[] = [
    {
        key: 'first_name',
        label: 'First Name',
        type: 'text',
        required: true,
    },
    {
        key: 'last_name',
        label: 'Last Name',
        type: 'text',
        required: true
    },
    {
        key: 'company',
        label: 'Company',
        type: 'text'
    },
    {
        key: 'phone',
        label: 'Phone',
        type: 'tel'
    },
    {
        key: 'website',
        label: 'Website',
        type: 'text'
    },
    {
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true
    },
    {
        key: 'assigned_to',
        label: 'Assigned To',
        type: 'select',
        required: true
    },
]

export const contactFilterFields: InputItem[] = [
    {
        key: 'first_name',
        label: 'first name',
        type: 'text'
    },
    {
        key: 'last_name',
        label: 'last name',
        type: 'text'
    },
    {
        key: 'email',
        label: 'Email',
        type: 'email'
    },
    {
        key: 'office_phone',
        label: 'Office Phone',
        type: 'tel'
    },
    {
        key: 'assigned_to',
        label: 'Assigned To',
        type: 'select',
        required: true
    },
];

export const fullContactFields: InputItem[] = [
    {
        key: 'first_name',
        label: 'first name',
        type: 'text'
    },
    {
        key: 'last_name',
        label: 'last name',
        type: 'text'
    },
    {
        key: 'office_phone',
        label: 'office phone',
        type: 'tel'
    },
    {
        key: 'mobile',
        label: 'mobile',
        type: 'tel'
    },
    {
        key: 'lead_source',
        label: 'Lead Source',
        type: 'select',
        isClearable: false
    },
    {
        key: 'birthdate',
        label: 'Birthday',
        type: 'datetimepicker'
    },
    {
        key: 'email',
        label: 'Email',
        type: 'email'
    },
    {
        key: 'secondary_email',
        label: 'Secondary Email',
        type: 'email'
    },
    {
        key: 'email_opt_out',
        label: 'Email Opt Out',
        type: 'checkbox'
    },
    {
        key: 'not_call',
        label: 'Do Not Call',
        type: 'checkbox'
    },
    {
        key: 'assigned_to',
        label: 'Assigned To',
        type: 'select',
        required: true,
        isClearable: false
    },
    {
        key: 'mailing_street',
        label: 'Mailing Street 	',
        type: 'text'
    },
    {
        key: 'mailing_city',
        label: 'Mailing City',
        type: 'text'
    },
    {
        key: 'mailing_state',
        label: 'Mailing State',
        type: 'text'
    },
    {
        key: 'mailing_country',
        label: 'Mailing Country',
        type: 'text'
    },
    {
        key: 'mailing_zip',
        label: 'Mailing ZIP',
        type: 'text'
    },
    {
        key: 'mailing_po',
        label: 'Mailing Po Box',
        type: 'text'
    },
    {
        key: 'description',
        label: 'Description Details',
        type: 'textarea'
    }
]

export const fullOpportunityFields: InputItem[] = [
    {
        key: 'title',
        label: 'Potential Name',
        type: 'text',
        required: true,
    },
    {
        key: 'contact',
        label: 'Contact',
        placeholder: 'Search a Contact',
        type: 'select',
        required: true,
        isClearable: false,
        isAsyncSelect: true,
        isMultiSelect: true
    },
    {
        key: 'assigned_to',
        label: 'Assigned To',
        type: 'select',
        required: true,
        isClearable: false
    },
    {
        key: 'related_services',
        label: 'Selected Services',
        isClearable: true,
        type: 'select',
        isMultiSelect: true
    },
    {
        key: 'lead_source',
        label: 'Lead Source',
        type: 'select',
    },
    {
        key: 'lead_status',
        label: 'Lead Status',
        type: 'select',
        required: true,
    },
    {
        key: 'close_date',
        label: 'Expected Close Date',
        type: 'datetimepicker'
    },
    {
        key: 'description',
        label: 'Description Details',
        type: 'textarea'
    },
    {
        key: 'location',
        label: 'Location',
        type: 'section',
        children: [
            {
                type: 'select',
                key: 'country',
                label: 'Country'
            },
            {
                type: 'select',
                key: 'state',
                label: 'State'
            },
            {
                key: 'city',
                label: 'City',
                type: 'select'
            }
        ]
    }
];

export const opportunityFields: InputItem[] = [
    {
        key: 'title',
        label: 'Name',
        type: 'text',
    },
    {
        key: 'lead_status',
        label: 'Lead Status',
        type: 'select',
    },
    {
        key: 'lead_source',
        label: 'Lead Source',
        type: 'select',
    },
    {
        key: 'close_date',
        label: 'Expected Close Date',
        type: 'datetimepicker'
    },
    {
        key: 'assigned_to',
        label: 'Assigned To',
        type: 'select'
    }
];

export const fullLeadFields: InputItem[] = [
    ...leadFields,
    {
        key: 'mobile',
        label: 'Mobile',
        type: 'tel'
    },
    {
        key: 'secondary_email',
        label: 'Secondary Email',
        type: 'email'
    },
    {
        key: 'lead_source',
        label: 'Lead Source',
        type: 'select',
        options: []
    },
    {
        key: 'industry',
        label: 'Industry',
        type: 'select',
        options: []
    },
    {
        key: 'lead_status',
        label: 'Lead Status',
        type: 'select',
        options: []
    },
    {
        key: 'requested_property',
        label: 'Requested Services',
        type: 'select',
        options: []
    },
    {
        key: 'description',
        label: 'Description Details',
        type: 'textarea'
    }
]

