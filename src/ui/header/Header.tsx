import { useRef } from "react";
import { Logo } from "../Logo"
import MegaMenu from "./MegaMenu";
import { Menu } from "./Menu"
import { IoMenuSharp } from "react-icons/io5";
import useMenu from "../../hooks/useMenu";

export const Header = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [open, handleOpen] = useMenu(ref);

    return (
        <header className="py-4 px-10  flex justify-between">
            <div className="flex items-center space-x-4">
                <Logo />
                <button onClick={handleOpen} className="cursor-pointer relative">
                    <IoMenuSharp size={20} />
                    {open && <MegaMenu ref={ref} />}
                </button>
            </div>
            <Menu />
        </header>
    )
}
