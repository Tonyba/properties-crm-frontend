import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Link, NavLink, Outlet } from "react-router";
import { ModuleContentWrapper } from "../../components/wrappers";
import { FaAddressCard } from "react-icons/fa";
import { iconSize } from "../../helpers/constants";
import { FaWhatsapp } from "react-icons/fa";

import { useSingleLeadSuspense } from "../../hooks/useSingleLead";
import type { Lead, SingleModuleMoreBtnActionType } from "../../helpers/types";
import { FilterButton } from "../../components/FilterButton";
import { WhatsappBtn } from "../../components/WhatsappBtn";
import { LeadOptions } from "../../helpers/menus";
import { SingleModuleMoreBtn } from "../../components/SingleModuleMoreBtn";
import { useModuleHeader } from "../../hooks/useModuleHeader";
import { useNavigate } from 'react-router';
import { useHandleItemDeletion } from "../../hooks/useHandleItemDeletion";
import { useOffcanvas, useOffcanvasMutation } from "@/hooks/useOffcanvas";

export default function LeadDetails() {

    const { data: lead } = useSuspenseQuery(useSingleLeadSuspense(true));
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { deleteFn } = useHandleItemDeletion(moduleSingle ?? 'Lead');

    const { mutate: mutateOffcanvas } = useOffcanvasMutation({ queryClient });
    const { data: offcanvasOpts } = useOffcanvas({ queryClient });

    const singleLead = lead as Lead;
    const menu = LeadOptions(singleLead.id);

    const leadMoreActions: SingleModuleMoreBtnActionType[] = [
        {
            fn: async () => {
                const resp = await deleteFn(singleLead.id);
                if (resp?.isConfirmed) navigate('/marketing');
            },
            label: 'Delete Lead',
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
                        <div className="mb-5" >{singleLead.first_name} {singleLead.last_name}</div>

                        <div className="text-gray-400 text-xs">Email</div>
                        <a className='text-xs' href={`mailto:${singleLead.email}`} >{singleLead.email}</a>
                    </div>

                </div>

                <div className="flex gap-1">
                    <FilterButton> <Link to={`/marketing/leads/${singleLead.id}/edit`}>Edit</Link></FilterButton>
                    <FilterButton onClick={handleSendEmail} >Send Email</FilterButton>
                    <FilterButton>Convert Lead</FilterButton>

                    <SingleModuleMoreBtn actions={leadMoreActions} />

                    {singleLead.phone
                        && <WhatsappBtn href={`https://api.whatsapp.com/send/?phone=${singleLead.phone}`} target="_blank">
                            <FaWhatsapp size={iconSize + 5} color="white" />
                        </WhatsappBtn>
                    }

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
