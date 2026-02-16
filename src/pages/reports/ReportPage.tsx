import { ModuleContent, SidebarContainer, SidebarWrapper } from "@/components/ModuleComponents"
import { ModuleHeader } from "@/ui/module_header/ModuleHeader"
import { ModuleSidebarMenu } from "@/ui/module_sidebar_menu/ModuleSidebarMenu"
import { HiOutlineDocumentReport } from "react-icons/hi"
import { Outlet } from "react-router"

const title = "Reports";
const basePath = '/reports';
const iconSize = 20;
const color = '#3CB878';
const baseIcon = <HiOutlineDocumentReport size={iconSize} />;

const items = [
    {
        label: 'Create Report',
        icon: <HiOutlineDocumentReport size={iconSize} />,
        path: `${basePath}/add`,
    }
];

const ReportPage = () => {
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

export default ReportPage