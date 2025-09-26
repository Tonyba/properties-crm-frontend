import { FaUser } from "react-icons/fa";
import type { InputItem, OffcanvasProps } from "./types";
import { megabytesToBytes } from "./helpers";

export const API_URL = 'http://properties-crm.local/wp-admin/admin-ajax.php';

export const headerHeight = 72;
export const iconSize = 20

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

export const DocumentUploadFormFields: InputItem[] = [
    {
        key: 'uploaded_file',
        type: 'upload'
    },
    {
        key: 'external_url',
        type: 'text',
        label: 'File Url',
        required: true
    },
    {
        key: 'title',
        label: 'Title',
        type: 'text',
        required: true
    },
    {
        key: 'assigned_to',
        label: 'Assigned to',
        type: 'select',
        required: true,
        isClearable: false
    },
    {
        key: 'note',
        label: 'Note',
        type: 'textarea'
    },
    {
        key: 'download_type',
        label: 'Download Type',
        type: 'select',
        isClearable: false
    },
    {
        key: 'relation',
        label: 'Relation',
        type: 'hidden'
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
        label: 'Requested Property',
        type: 'select',
        options: []
    },
    {
        key: 'description',
        label: 'Description Details',
        type: 'textarea'
    }
]

