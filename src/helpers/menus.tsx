import { IoDiamondOutline, IoDocumentTextOutline } from "react-icons/io5";
import { PiSquaresFour } from "react-icons/pi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaUsersViewfinder } from "react-icons/fa6";
import { BiUserPin } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { MdOutlineAttachMoney, MdOutlineHouse } from "react-icons/md";
import { GiFlagObjective } from "react-icons/gi";
import { LuUserRound } from "react-icons/lu";
import { BiCog } from "react-icons/bi";
import { GoCreditCard } from "react-icons/go";
import { CiViewList } from "react-icons/ci";
import { LuChartLine } from "react-icons/lu";
import { FaRegEnvelope } from "react-icons/fa6";
import { LuFileSpreadsheet } from "react-icons/lu";
import { FaBullhorn } from "react-icons/fa6";
import { FaRegComments } from "react-icons/fa";

const iconSize = 20;
const footerIconSize = 14;

const megaMenuItems = [
    {
        path: '/',
        label: 'Essentials',
        icon: <IoDiamondOutline size={iconSize} />,
        color: '#6574c4',
        subItems: [
            {
                path: '/',
                label: 'Dashboard',
                icon: <PiSquaresFour size={iconSize} />,
            },
            {
                path: '/properties',
                label: 'Properties',
                icon: <MdOutlineHouse size={iconSize} />,
            },
            {
                path: '/sales',
                label: 'Opportunities',
                icon: <MdOutlineAttachMoney size={iconSize} />,
                separator: true
            },
            {
                path: '/document',
                label: 'Documents',
                icon: <IoDocumentTextOutline size={iconSize} />,
            },
            {
                path: '/calendar',
                label: 'Calendar',
                icon: <FaRegCalendarAlt size={iconSize} />,
            },
        ]
    },
    {
        path: '/marketing',
        label: 'Marketing',
        icon: <FaUsersViewfinder size={iconSize} />,
        color: '#EF5E29',
        subItems: [
            {
                path: '/marketing',
                label: 'Leads',
                icon: <BiUserPin size={iconSize} />,
            },
            {
                path: 'marketing/contacts',
                label: 'Contacts',
                icon: <FaUser size={iconSize} />,
            }
        ]
    },
    {
        path: '/sales',
        label: 'Sales',
        icon: <FaUsersViewfinder size={iconSize} />,
        color: '#3cb979',
        subItems: [
            {
                path: '/sales',
                label: 'Oportunities',
                icon: <MdOutlineAttachMoney size={iconSize} />,
            },
            {
                path: '/sales/objetives',
                label: 'Objectives',
                icon: <GiFlagObjective size={iconSize} />,
            }
        ]
    }
];

const megaFooterOptions = [
    {
        path: '/users',
        label: 'Manage Users',
        icon: <LuUserRound size={footerIconSize} />,
    },
    {
        path: '/settings',
        label: 'CRM Settings',
        icon: <BiCog size={footerIconSize} />,
    },

]

const LeadOptions = (id: number) => {

    const baseUrl = '/marketing/leads';

    return [
        {
            path: `${baseUrl}/${id}/details`,
            label: 'Summary',
            icon: <GoCreditCard />,
        },
        {
            path: `${baseUrl}/${id}/details/data`,
            label: 'Details',
            icon: <CiViewList />,
        },
        {
            path: `${baseUrl}/${id}/details/updates`,
            label: 'Updates',
            icon: <LuChartLine />,
        },
        {
            path: `${baseUrl}/${id}/details/activities`,
            label: 'Activities',
            icon: <FaRegCalendarAlt />,

        },
        {
            path: `${baseUrl}/${id}/details/emails`,
            label: 'Emails',
            icon: <FaRegEnvelope />
        },
        {
            path: `${baseUrl}/${id}/details/documents`,
            label: 'Documents',
            icon: <LuFileSpreadsheet />,
        },
        {
            path: `${baseUrl}/${id}/details/campaigns`,
            label: 'Campaigns',
            icon: <FaBullhorn />,
        },
        {
            path: `${baseUrl}/${id}/details/comments`,
            label: 'Comments',
            icon: <FaRegComments />
        },
    ];

}

const ContactOptions = (id: number) => {

    const baseUrl = '/marketing/contacts';

    return [
        {
            path: `${baseUrl}/${id}/details`,
            label: 'Summary',
            icon: <GoCreditCard />,
        },
        {
            path: `${baseUrl}/${id}/details/data`,
            label: 'Details',
            icon: <CiViewList />,
        },
        {
            path: `${baseUrl}/${id}/details/updates`,
            label: 'Updates',
            icon: <LuChartLine />,
        },
        {
            path: `${baseUrl}/${id}/details/activities`,
            label: 'Activities',
            icon: <FaRegCalendarAlt />,

        },
        {
            path: `${baseUrl}/${id}/details/emails`,
            label: 'Emails',
            icon: <FaRegEnvelope />
        },
        {
            path: `${baseUrl}/${id}/details/documents`,
            label: 'Documents',
            icon: <LuFileSpreadsheet />,
        },
        {
            path: `${baseUrl}/${id}/details/campaigns`,
            label: 'Campaigns',
            icon: <FaBullhorn />,
        },
        {
            path: `${baseUrl}/${id}/details/comments`,
            label: 'Comments',
            icon: <FaRegComments />
        },
    ];

}

export {
    megaMenuItems,
    megaFooterOptions,
    LeadOptions,
    ContactOptions
}