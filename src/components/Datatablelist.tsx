import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import type { InputItem } from "../helpers/types";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useModuleHeader } from "../hooks/useModuleHeader";
import { useAgents } from "../hooks/useAgents";
import { useSingleList } from "../hooks/useSingleList";
import TableFilters from "../ui/table_filters/TableFilters";
import DataTable from "react-data-table-component";
import { ModuleContentWrapper } from "./wrappers";
import { useServices } from "../hooks/userServices";
import { DataKanban } from "./DataKanban";

export type DatatableListProps = {
    dataCols: {
        name: string | undefined;
        selector: (row: any) => string | number | boolean;
    }[];
    get_fn: (request: any) => Promise<any>;
    filterFields: InputItem[];
}

const DatableList = ({ dataCols, get_fn, filterFields }: DatatableListProps) => {


    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [tableFilters, setFilters] = useState(filterFields);
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();
    const queryClient = useQueryClient();
    const [firstTime, setFirstTime] = useState(true);
    const [request, setRequest] = useState({
        perPage: 20,
        page: 1,
        filters: {}
    });
    const { data: agents } = useAgents();
    const { data: services } = useServices();

    const fetching = useIsFetching({ queryKey: [`${moduleSingle}/list`] }) > 0;

    const handleSearch = (filtersValues: InputItem[]) => {

        let newFilters: any = {};

        filtersValues.map(filter => {
            if (filter.value) newFilters[filter.key] = filter.value
        });
        setRequest({ ...request, page: 1, filters: newFilters });
    }

    const handlePaginationChange = (page: number) => {
        setRequest({ ...request, page });
    }

    const handleChangePerPage = async (newPerPage: number, page: number) => {
        if (!firstTime) setRequest({ ...request, perPage: newPerPage, page });
        setFirstTime(false);
    }

    const handleRowClick = (row: any) => {
        const path = location.pathname.split('/');
        const lastPart = path[path.length - 1];
        let pathToUse = `./${row.id}/details`;

        if (!lastPart.includes(moduleSingle?.toLowerCase() ?? '')) pathToUse = `${moduleSingle?.toLowerCase()}/${row.id}/details`;

        navigate(pathToUse);
    }


    const { data } = useSingleList(request, get_fn);

    useEffect(() => {

        const newFilters = [...tableFilters];

        newFilters.map(field => {
            if (field.key == 'assigned_to') {
                field.options = agents?.map(agent => ({ label: agent.name, value: agent.id.toString() }));
                field.isMultiSelect = true;
            }
        });

        const invalidate = async () => {

            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/list`] });
        };

        if (!firstTime) invalidate();

        setFilters(newFilters);

        return () => { }

    }, [request.perPage, JSON.stringify(request.filters), agents, services]);


    return (
        <ModuleContentWrapper>
            <TableFilters searchFn={handleSearch} filters={tableFilters} />

            {searchParams.get('view') == 'kanban'
                ? <div className="mt-10"><DataKanban /></div>
                : <DataTable
                    columns={[...dataCols]}
                    progressPending={fetching}
                    responsive
                    highlightOnHover
                    pointerOnHover
                    pagination
                    paginationPerPage={request.perPage}
                    paginationTotalRows={data?.recordsFiltered}
                    paginationServer
                    data={data?.data ?? []}
                    onChangeRowsPerPage={handleChangePerPage}
                    onChangePage={handlePaginationChange}
                    onRowClicked={handleRowClick}
                />
            }



        </ModuleContentWrapper>
    )
}

export default DatableList;