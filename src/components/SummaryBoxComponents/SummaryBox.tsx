import { IoChevronDown } from "react-icons/io5"

import { FaPlus } from "react-icons/fa"
import { FaCaretDown } from "react-icons/fa6"

import { SummaryBoxData } from "./SummaryBoxData"
import { SingleBoxContainer, SingleBoxTitle } from "../SingleDetailBox"
import { Dropdown } from "../Dropdown"
import { FilterButton } from "../FilterButton"
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
