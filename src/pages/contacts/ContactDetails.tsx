import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Link, NavLink, Outlet } from "react-router";
import { ModuleContentWrapper } from "../../components/wrappers";
import { FaAddressCard } from "react-icons/fa";
import { iconSize } from "../../helpers/constants";

import type { Contact, SingleModuleMoreBtnActionType } from "../../helpers/types";
import { FilterButton } from "../../components/FilterButton";
import { ContactOptions } from "../../helpers/menus";
import { SingleModuleMoreBtn } from "../../components/SingleModuleMoreBtn";
import { useModuleHeader } from "../../hooks/useModuleHeader";
import { useNavigate } from 'react-router';
import { useHandleItemDeletion } from "../../hooks/useHandleItemDeletion";
import { useGetSingleSuspense } from "../../hooks/useGetSingle";
import { get_contact } from "../../api/contacts";
import { useOffcanvas, useOffcanvasMutation } from "@/hooks/useOffcanvas";


export default function ContactDetails() {

    const { data: contact } = useSuspenseQuery(useGetSingleSuspense(get_contact, true));
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { deleteFn } = useHandleItemDeletion(moduleSingle ?? 'Contact');

    const singleContact = contact as Contact;
    const menu = ContactOptions(parseInt(singleContact?.id?.toString() ?? 0));



    const ContactMoreActions: SingleModuleMoreBtnActionType[] = [
        {
            fn: async () => {
                const resp = await deleteFn(parseInt(singleContact.id.toString()));
                if (resp?.isConfirmed) navigate('/marketing/contacts');
            },
            label: 'Delete Contact',
        },
        {
            fn: () => { },
            label: 'Duplicate'
        },
        {
            fn: () => { },
            label: 'send SMS',
            isDivider: true
        },
        {
            fn: () => { },
            label: 'Add Event',

        },
        {
            fn: () => { },
            label: 'Add ask'
        }
    ];

    const { mutate: mutateOffcanvas } = useOffcanvasMutation({ queryClient });
    const { data: offcanvasOpts } = useOffcanvas({ queryClient });


    const handleSendEmail = () => {
        mutateOffcanvas({
            queryClient,
            offCanvasOpts: {
                ...offcanvasOpts,
                title: 'Send Email',
                template: 'email',
                size: 'xl',
            }
        });
    }


    return (
        <ModuleContentWrapper>

            <div className="flex justify-between items-start mb-5">

                <div className="flex gap-3">

                    <div className="w-20 h-20 bg-amber-500 flex items-center justify-center">
                        <FaAddressCard size={iconSize + 10} color="white" />
                    </div>

                    <div>
                        <div className="mb-5" >{singleContact.first_name} {singleContact.last_name}</div>

                        <div className="text-gray-400 text-xs">Email</div>
                        <a className='text-xs' href={`mailto:${singleContact.email}`} >{singleContact.email}</a>
                    </div>

                </div>

                <div className="flex gap-1">
                    <FilterButton> <Link to={`/marketing/contacts/${singleContact.id}/edit`}>Edit</Link></FilterButton>
                    <FilterButton onClick={handleSendEmail} >Send Email</FilterButton>

                    <SingleModuleMoreBtn actions={ContactMoreActions} />

                </div>
            </div>

            <div className="border-gray-200 border-b-1 text-sm mb-5">
                {menu.map(opt => <NavLink key={opt.path} to={opt.path}
                    className={({ isActive }) =>
                        `pb-2 inline-flex gap-2 px-2 items-center ${isActive ? 'border-b-2 border-black font-medium' : ''} `
                    }>{opt.icon} {opt.label}</NavLink>)}
            </div>

            <Outlet />

        </ModuleContentWrapper>
    )
}
