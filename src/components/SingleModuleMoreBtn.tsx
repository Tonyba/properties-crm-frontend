import { FaCaretDown } from "react-icons/fa"
import { iconSize } from "../helpers/constants"
import useMenu from "../hooks/useMenu";
import { useRef } from "react";
import { DropdownButton, DrowpdownContent } from "./DrowdownButton";
import type { SingleModuleMoreBtnActionType } from "../helpers/types";

type SingleModuleMoreBtnProps = {
    actions: SingleModuleMoreBtnActionType[]
}

export const SingleModuleMoreBtn = ({ actions }: SingleModuleMoreBtnProps) => {

    const dropDownBtnRef = useRef<HTMLDivElement>(null);
    const [open, handleOpen] = useMenu(dropDownBtnRef);

    return (
        <DropdownButton onClick={handleOpen} className='gap-1'>
            More <FaCaretDown size={iconSize - 6} />
            {open &&
                <DrowpdownContent ref={dropDownBtnRef}>

                    {actions.map((action, i) => {
                        return <div className={action.isDivider ? 'border-b-1 border-black pb-2 mb-1' : ''} key={i} onClick={action.fn}>{action.label}</div>
                    })}

                </DrowpdownContent>
            }
        </DropdownButton>
    )
}
