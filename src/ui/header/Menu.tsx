import { NavLink } from "react-router";
import { LuCirclePlus } from "react-icons/lu";
import { IoCalendarOutline } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";
import QuickAdd from "../quickAdd/quickAdd";
import { useRef } from "react";
import useMenu from "../../hooks/useMenu";

const iconSize = 20;

export const Menu = () => {

    const quickRef = useRef(null)
    const [open, handleOpen] = useMenu(quickRef);


    return (
        <div className="flex space-x-5 [&>*]:cursor-pointer items-center">
            <div className="relative flex">
                <button className="cursor-pointer" onClick={handleOpen} title="Quick add"> <LuCirclePlus size={iconSize} /> </button>
                {open && (
                    <QuickAdd ref={quickRef} />
                )}
            </div>

            <NavLink to='/calendar' title="Calendar"> <IoCalendarOutline size={iconSize} /> </NavLink>
            <NavLink to='/reports' title="Reports"> <HiOutlineDocumentReport size={iconSize} /> </NavLink>
        </div>
    )
}
