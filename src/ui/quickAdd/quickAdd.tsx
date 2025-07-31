import { IoDocumentTextOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { LuIdCard } from "react-icons/lu";

import { Link } from "react-router";

import './quickAdd.css';
import type { RefObject } from "react";

const iconSize = 20;
const items = [
    {
        label: 'Document',
        icon: <IoDocumentTextOutline size={iconSize} />,
        path: '/document/create',
    },
    {
        label: 'Lead',
        icon: <LuIdCard size={iconSize} />,
        path: '/lead/create',
    },
    {
        label: 'Contact',
        icon: <FaUser size={iconSize} />,
        path: '/contact/create',
    },
    {
        label: 'Opportunity',
        icon: <MdOutlineAttachMoney size={iconSize} />,
        path: '/opportunity/create'
    },
]

type propType = {
    ref?: RefObject<any>;
}

export default function QuickAdd(props: propType) {
    return (
        <div ref={props.ref} className="absolute top-full right-full min-w-xl bg-white shadow-md rounded-sm p-5">
            <h3 className="pb-1 border-b mb-4 border-gray-400 font-medium">Quick Add</h3>
            <div className="grid grid-cols-3 gap-5">
                {items.map(function (item) {
                    return <Link key={item.path} className="flex gap-2" to={item.path}>
                        <span className="shrink-0">{item.icon}</span>
                        {item.label}
                    </Link>;
                })}
            </div>
        </div>

    )
}
