import { FaCaretDown, FaPlus } from "react-icons/fa"
import { FilterButton } from "../FilterButton"
import { Dropdown } from "../Dropdown"
import type { SummaryBoxAction } from "../../helpers/types"

type SummaryActionsProps = {
    summaryActions: SummaryBoxAction[]
}

export const SummaryActions = ({ summaryActions }: SummaryActionsProps) => {
    return <div className="ml-auto font-normal flex gap-2" >
        {summaryActions?.map(({ action, isWithSelect, action_fn, options }, key) => {
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
}