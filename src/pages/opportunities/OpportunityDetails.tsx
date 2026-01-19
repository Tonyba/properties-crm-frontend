import { FaMoneyBill } from "react-icons/fa"
import { ModuleContentWrapper } from "../../components/wrappers"
import { iconSize } from "../../helpers/constants"
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetSingleSuspense } from "../../hooks/useGetSingle";
import { get_opportunity } from "../../api/opportunities";
import { FilterButton } from "../../components/FilterButton";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { SingleModuleMoreBtn } from "../../components/SingleModuleMoreBtn";
import { useHandleItemDeletion } from "../../hooks/useHandleItemDeletion";
import type { Opportunity, SelectOption, SingleModuleMoreBtnActionType } from "../../helpers/types";
import { useModuleHeader } from "../../hooks/useModuleHeader";
import { DetailStageSelector } from "../../components/DetailStageSelector";
import { OpportunityOptions } from "@/helpers/menus";
import { useStages } from "@/hooks/useStages";

const OpportunityDetails = () => {

    const { data: opportunity } = useSuspenseQuery(useGetSingleSuspense(get_opportunity, true));
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();
    const navigate = useNavigate();
    const { deleteFn } = useHandleItemDeletion(moduleSingle ?? 'Opportunity');
    const singleOpportunity = opportunity as Opportunity;
    const { data: stages } = useStages();

    const OpportunityMoreActions: SingleModuleMoreBtnActionType[] = [
        {
            fn: async () => {
                const resp = await deleteFn(parseInt(singleOpportunity.id.toString()));
                if (resp?.isConfirmed) navigate('/sales');
            },
            label: 'Delete Opportunity',
        },
        {
            isDivider: true,
            fn: () => { },
            label: 'Duplicate'
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

    const menu = OpportunityOptions(parseInt(singleOpportunity?.id?.toString() ?? 0));

    return (
        <ModuleContentWrapper>
            <div className="flex justify-between items-start mb-5">

                <div className="flex gap-3">

                    <div className="w-20 h-20 bg-green-500 flex items-center justify-center">
                        <FaMoneyBill size={iconSize + 10} color="white" />
                    </div>

                    <div>
                        <div className="mb-5" >{singleOpportunity.title}</div>

                        <div className="flex gap-4 mb-5">
                            <div className="flex flex-col">
                                <div className="text-gray-400 text-xs">Stage</div>
                                <div className='text-xs'>
                                    {(stages as SelectOption[])?.find(stage => (stage as SelectOption)?.value === singleOpportunity.lead_status)?.label}
                                </div>
                            </div>
                        </div>

                        <DetailStageSelector />
                    </div>

                </div>

                <div className="flex gap-1">
                    <FilterButton> <Link to={`/marketing/leads/${singleOpportunity.id}/edit`}>Edit</Link></FilterButton>
                    <FilterButton>Send Email</FilterButton>

                    <SingleModuleMoreBtn actions={OpportunityMoreActions} />
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

export default OpportunityDetails