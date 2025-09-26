import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Link, NavLink, useParams, Outlet } from "react-router";
import { ModuleContentWrapper } from "../../components/wrappers";
import { FaAddressCard } from "react-icons/fa";
import { iconSize } from "../../helpers/constants";
import { FaWhatsapp } from "react-icons/fa";

import { useSingleLead } from "../../hooks/useSingleLead";
import type { Lead } from "../../helpers/types";
import { FilterButton } from "../../components/FilterButton";
import { WhatsappBtn } from "../../components/WhatsappBtn";
import { FaCaretDown } from "react-icons/fa";
import { DropdownButton, DrowpdownContent } from "../../components/DrowdownButton";
import { useRef } from "react";
import useMenu from "../../hooks/useMenu";
import { LeadOptions } from "../../helpers/menus";


export default function LeadDetails() {

    const params = useParams();
    const queryClient = useQueryClient();


    const { data: lead } = useSuspenseQuery(useSingleLead(params.leadId ?? '', true, queryClient));
    const singleLead = lead as Lead;

    const dropDownBtnRef = useRef<HTMLDivElement>(null);
    const [open, handleOpen] = useMenu(dropDownBtnRef);

    const menu = LeadOptions(singleLead.id);



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
                    <FilterButton>Send Email</FilterButton>
                    <FilterButton>Convert Lead</FilterButton>

                    <DropdownButton onClick={handleOpen} className='gap-1'>
                        More <FaCaretDown size={iconSize - 6} />

                        {open &&
                            <DrowpdownContent ref={dropDownBtnRef}>
                                <div>Delete Lead</div>
                                <div>Duplicate</div>
                                <div className="border-b-1 border-black pb-2 mb-1">Send SMS</div>
                                <div>
                                    Add Event
                                </div>
                                <div>Add Task</div>
                            </DrowpdownContent>
                        }
                    </DropdownButton>

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
