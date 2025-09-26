import { IoChevronDown } from "react-icons/io5"

import { FaPlus } from "react-icons/fa"
import { FaCaretDown } from "react-icons/fa6"

import { SummaryBoxData } from "./SummaryBoxData"
import { SingleBoxContainer, SingleBoxTitle } from "../SingleDetailBox"
import { Dropdown } from "../Dropdown"
import { FilterButton } from "../FilterButton"

export type ActionOptType = {
    label: string,
    icon: React.ReactNode,
    optFn: Function
}

interface SummaryBoxProps {
    title: string,
    noFoundMessage?: string,
    isComments?: boolean,
    actions?: {
        action: string,
        isWithSelect?: boolean,
        action_fn?: Function,
        options?: ActionOptType[]
    }[]
}

export const SummaryBox = ({ title, actions, noFoundMessage }: SummaryBoxProps) => {

    return (
        <SingleBoxContainer>
            <SingleBoxTitle>
                <IoChevronDown /> {title}
                <div className="ml-auto font-normal flex gap-2" >
                    {actions?.map(({ action, isWithSelect, action_fn, options }, key) => {

                        return isWithSelect
                            ? <Dropdown key={key} callback={action_fn} options={options ? options : []} triggerElement={
                                <FilterButton key={key} className="ml-auto font-normal relative" >
                                    <FaPlus />
                                    New {action}
                                    {isWithSelect && <FaCaretDown />}
                                </FilterButton>
                            }></Dropdown>
                            : <FilterButton onClick={action_fn} key={key} className="ml-auto font-normal relative" >
                                <FaPlus />
                                New {action}
                            </FilterButton>
                    })}
                </div>
            </SingleBoxTitle>

            <div className="text-center text-sm">
                <SummaryBoxData noFoundMessage={noFoundMessage} boxKey={title} />
            </div>

        </SingleBoxContainer>
    )
}
