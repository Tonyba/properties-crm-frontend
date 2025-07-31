import { FilterButton } from "../../components/FilterButton";
import { FaFilter } from "react-icons/fa";
import { LiaPlusSolid } from "react-icons/lia";
import { Link } from "react-router";
import { GrDownload } from "react-icons/gr";
import { BsChevronDown } from "react-icons/bs";
import { useModuleHeader } from "../../hooks/useModuleHeader";



export const ModuleHeader = () => {

    const [
        createPath, filter, importBtn, moduleSingle
    ] = useModuleHeader();

    return (
        <div className="flex justify-between bg-[#eef1f4] py-2 px-4  gap-2">
            <div>
                {filter &&
                    <FilterButton>
                        <FaFilter size={14} />
                        All
                        <BsChevronDown size={14} />
                    </FilterButton>
                }

            </div>
            <div className="flex gap-2 text-[13px]">

                {createPath &&
                    <Link to={createPath} className="flex">
                        <FilterButton>
                            <LiaPlusSolid size={14} />
                            Add {moduleSingle}
                        </FilterButton>
                    </Link>
                }

                {importBtn && <FilterButton>
                    <GrDownload size={14} />
                    Import
                </FilterButton>}
            </div>
        </div>
    )
}
