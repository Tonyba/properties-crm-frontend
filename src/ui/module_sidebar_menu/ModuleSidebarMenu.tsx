import { Link, NavLink } from "react-router";
import type { ReactElement } from "react";

type ModuleSidebarMenuItem = {
  label: string;
  icon: ReactElement;
  path: string
};

type props = {
  basePath: string;
  baseIcon: ReactElement;
  color: string;
  title: string;
  items: ModuleSidebarMenuItem[];
};

export const ModuleSidebarMenu = ({ color, items, title, basePath, baseIcon }: props) => {
  return (
    <div className="bg-neutral-800 h-full">
      <h1 style={{ backgroundColor: color }}>
        <Link className="uppercase flex gap-3 items-center text-white px-6 py-3 " to={basePath}>{baseIcon} {title}</Link>
      </h1>
      <div className="uppercase text-[13px]">
        {items.map((item) => {
          return <NavLink to={item.path} className={({ isActive }) => isActive ? 'flex items-center px-6 py-3 gap-2.5 bg-black text-white' : 'hover:bg-gray-600 hover:opacity-100 flex items-center px-6 py-3 gap-2.5 text-white opacity-60'} key={item.path + title}>
            {item.icon} {item.label}
          </NavLink>;
        })}
      </div>
    </div>
  )
}
