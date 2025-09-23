import { IoChevronDown } from "react-icons/io5"
import { SingleBoxContainer, SingleBoxTitle } from "./SingleDetailBox"
import { FilterButton } from "./FilterButton"
import { FaPlus } from "react-icons/fa"
import { FaCaretDown } from "react-icons/fa6"

interface SummaryBoxProps {
    title: string,
    noFoundMessage?: string,
    isComments?: boolean,
    actions?: {
        action: string,
        isWithSelect?: boolean,
        function?: Function
    }[]
}

export const SummaryBox = ({ title, actions, noFoundMessage }: SummaryBoxProps) => {
    return (
        <SingleBoxContainer>

            <SingleBoxTitle>

                <IoChevronDown /> {title}


                <div className="ml-auto font-normal flex gap-2" >
                    {actions?.map(({ action, isWithSelect }) => (
                        <FilterButton className="ml-auto font-normal" >
                            <FaPlus />
                            New {action}
                            {isWithSelect && <FaCaretDown />}

                        </FilterButton>
                    ))}

                </div>

            </SingleBoxTitle>

            <div className="text-center text-sm"> {noFoundMessage ? noFoundMessage : `No Related ${title}`} </div>

        </SingleBoxContainer>
    )
}
