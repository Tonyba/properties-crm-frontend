import { Outlet } from "react-router"
import { ModuleSidebarMenu } from "../../ui/module_sidebar_menu/ModuleSidebarMenu"
import { LuIdCard } from "react-icons/lu";
import { FaUsersViewfinder } from "react-icons/fa6";
import { contactIcon } from "../../helpers/constants";
import { ModuleHeader } from "../../ui/module_header/ModuleHeader";

const title = "Marketing";
const basePath = '/marketing';
const iconSize = 20;
const color = 'rgb(239, 94, 41)';
const baseIcon = <FaUsersViewfinder size={iconSize} />;
const items = [
    {
        label: 'Leads',
        icon: <LuIdCard size={iconSize} />,
        path: `${basePath}`,
    },
    {
        label: 'Contacts',
        icon: contactIcon,
        path: `${basePath}/contacts`,
    }
];

function LeadRoot() {
    return (
        <div className={`flex min-h-[calc(100vh_-_72px)] h-[calc(100%_-_72px)]`}>
            <div className="w-[180px]">
                <ModuleSidebarMenu
                    basePath={basePath}
                    baseIcon={baseIcon}
                    title={title}
                    color={color}
                    items={items}
                />
            </div>
            <div className="flex-1">

                <ModuleHeader />
                <Outlet />

            </div>
        </div>
    )
}

export default LeadRoot