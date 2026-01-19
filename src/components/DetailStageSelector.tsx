import { useStages } from "../hooks/useStages"
import { useGetSingle } from "../hooks/useGetSingle";
import { IoChevronDown } from "react-icons/io5";
import { enqueueSnackbar } from "notistack";
import { useMutateSingle } from "@/hooks/useMutateSingle";
import { create_opportunity, edit_opportunity } from "@/api/opportunities";
import type { Opportunity, SelectOption } from "@/helpers/types";
import { iconSize } from "@/helpers/constants";


export const DetailStageSelector = () => {

    const { mutate, isPending } = useMutateSingle({
        createFn: create_opportunity,
        updateFn: edit_opportunity,
        isEditing: true
    });

    const { data: stages } = useStages();
    const { data: opportunity } = useGetSingle<Opportunity>({});

    const changing_state_logic = (newStage: string) => {
        mutate({ ...opportunity, lead_status: newStage });
        enqueueSnackbar('Stage changed', { variant: 'success' });
    }


    return (
        <div className="flex">
            {stages && stages.map((stage) => (
                <div key={(stage as SelectOption)?.value + '-stage'} className="flex flex-col relative">
                    {opportunity.lead_status == (stage as SelectOption)?.value && (<IoChevronDown size={iconSize} className="absolute -top-4 left-1/2 transform -translate-x-1/2" />)}
                    <button
                        disabled={isPending}
                        onClick={() => changing_state_logic((stage as SelectOption)?.value)}
                        className={`px-2 cursor-pointer py-1 text-xs rounded-full mr-2 ${opportunity.lead_status == (stage as SelectOption)?.value ? (stage as SelectOption)?.label.includes('Lost') ? 'bg-red-500 text-white' : 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {(stage as SelectOption)?.label}
                    </button>
                </div>
            ))}
        </div>
    )

}
