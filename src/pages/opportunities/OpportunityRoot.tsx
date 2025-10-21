import { Outlet } from "react-router"
import { ModuleSidebarMenu } from "../../ui/module_sidebar_menu/ModuleSidebarMenu"
import { FaUsersViewfinder } from "react-icons/fa6";
import { ModuleHeader } from "../../ui/module_header/ModuleHeader";
import { MdOutlineAttachMoney } from "react-icons/md";
import { ModuleContent, SidebarContainer, SidebarWrapper } from "../../components/ModuleComponents";

const title = "Sales";
const basePath = '/sales';
const iconSize = 20;
const color = '#3CB878';
const baseIcon = <FaUsersViewfinder size={iconSize} />;
const items = [
    {
        label: 'Opportunities',
        icon: <MdOutlineAttachMoney size={iconSize} />,
        path: `${basePath}`,
    }
];

function OpportunityRoot() {
    return (
        <SidebarWrapper>
            <SidebarContainer>
                <ModuleSidebarMenu
                    basePath={basePath}
                    baseIcon={baseIcon}
                    title={title}
                    color={color}
                    items={items}
                />
            </SidebarContainer>
            <ModuleContent>
                <ModuleHeader />
                <Outlet />
            </ModuleContent>
        </SidebarWrapper>
    )
}

export default OpportunityRoot