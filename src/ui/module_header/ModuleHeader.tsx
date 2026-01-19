import { FilterButton } from "../../components/FilterButton";
import { FaFilter } from "react-icons/fa";
import { LiaPlusSolid } from "react-icons/lia";
import { Link } from "react-router";
import { GrDownload } from "react-icons/gr";
import { BsChevronDown } from "react-icons/bs";
import { useModuleHeader } from "../../hooks/useModuleHeader";
import { useSearchParams } from 'react-router';
import { useEffect } from "react";
import { CiCircleList } from "react-icons/ci";
import { BsKanban } from "react-icons/bs";
import { iconSize } from "@/helpers/constants";



export const ModuleHeader = () => {

    const [
        createPath, filter, importBtn, moduleSingle, showCreateBtn, showViewSwitcher
    ] = useModuleHeader();

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (showViewSwitcher) {
            const newSearchParams = new URLSearchParams(searchParams);
            if (!searchParams.get('view')) newSearchParams.set('view', 'kanban');
            setSearchParams(newSearchParams);
        }

    }, []);

    const handleViewChange = (value: 'table' | 'kanban') => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('view', value);
        setSearchParams(newSearchParams);
    };
    return (
        <div className="flex justify-between bg-[#eef1f4] py-2 px-4  gap-2 ">
            <div>
                {filter &&
                    <FilterButton>
                        <FaFilter size={14} />
                        All
                        <BsChevronDown size={14} />
                    </FilterButton>
                }

            </div>
            {showViewSwitcher && <div className="flex gap-5">
                <button className="cursor-pointer" title="List" onClick={() => handleViewChange('table')}>
                    <CiCircleList color={`${searchParams.get('view') == 'table' ? 'blue' : ''}`} size={iconSize + 5} />
                </button>

                <button className="cursor-pointer" title="Kanban" onClick={() => handleViewChange('kanban')}>
                    <BsKanban color={`${searchParams.get('view') == 'kanban' ? 'blue' : ''}`} size={iconSize + 5} />
                </button>
            </div>}
            <div className="flex gap-2 text-[13px]">
                {(createPath && showCreateBtn) &&
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
