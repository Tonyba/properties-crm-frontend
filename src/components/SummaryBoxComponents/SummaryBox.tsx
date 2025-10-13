import { IoChevronDown } from "react-icons/io5"


import { SummaryBoxData } from "./SummaryBoxData"
import { SingleBoxContainer, SingleBoxTitle } from "../SingleDetailBox"
import { SummaryActions } from "./SummaryActions"
import type { SummaryBoxAction } from "../../helpers/types"

export type ActionOptType = {
    label: string,
    icon: React.ReactNode,
    optFn: Function
}

interface SummaryBoxProps {
    title: string,
    noFoundMessage?: string,
    isComments?: boolean,
    actions?: SummaryBoxAction[]
}

export const SummaryBox = ({ title, actions, noFoundMessage }: SummaryBoxProps) => {

    return (
        <SingleBoxContainer>
            <SingleBoxTitle>
                <IoChevronDown /> {title}
                <SummaryActions summaryActions={actions ?? []} />
            </SingleBoxTitle>

            <div className="text-center text-sm">
                <SummaryBoxData noFoundMessage={noFoundMessage} boxKey={title} />
            </div>

        </SingleBoxContainer>
    )
}
