
import { type RefObject } from "react";
import { Link } from "react-router";
import { megaFooterOptions, megaMenuItems } from "../../helpers/menus";


type propType = {
    ref?: RefObject<any>;
}
export default function MegaMenu({ ref }: propType) {

    return (
        <div ref={ref} className="absolute top-full left-0 z-10 shadow-xl bg-white">
            <div className="flex">
                {megaMenuItems.map(function (item) {
                    return <div key={item.path + 'mega'} className="flex first:border-r-0 last:border-l-0 flex-col border-1 border-gray-300" >
                        <Link style={{ borderTopColor: item.color }} className="flex uppercase items-center gap-3  border-t-4 py-4 px-5 border-b-1 border-gray-300" to={item.path}>
                            {item.icon} {item.label}
                        </Link>
                        <div className="flex flex-col  pb-2 text-sm ">
                            {item.subItems.map((subItem) => {
                                return <Link className={`px-5 py-3 flex items-center gap-3 ${subItem.separator ? 'border-b-1 border-black pb-4' : ''}`} key={subItem.path + 'submega'} to={subItem.path}>{subItem.icon} {subItem.label}</Link>
                            })}
                        </div>
                    </div>;
                })}
            </div>
            <div className="flex gap-3 px-3 py-2 bg-gray-50 text-xs">
                {megaFooterOptions.map(function (item) {
                    return <Link key={item.path + 'footer'} className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 border-1 border-neutral-300 rounded-xs" to={item.path}>
                        {item.icon} {item.label}
                    </Link>
                })}
            </div>
        </div>
    )
}
