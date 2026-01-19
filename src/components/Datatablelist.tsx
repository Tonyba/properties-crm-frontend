import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import type { Column, InputItem, Opportunity } from "../helpers/types";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { useModuleHeader } from "../hooks/useModuleHeader";
import { useAgents } from "../hooks/useAgents";
import { useSingleList } from "../hooks/useSingleList";
import TableFilters from "../ui/table_filters/TableFilters";
import DataTable from "react-data-table-component";
import { ModuleContentWrapper } from "./wrappers";
import { DataKanban } from "./DataKanban";
import { useStages } from "@/hooks/useStages";
import { useSources } from "@/hooks/useSources";

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
        perPage: searchParams.get('view') == 'kanban' ? -1 : 20,
        page: 1,
        filters: {}
    });
    const { data: agents } = useAgents();
    const { data: stages } = useStages();
    const { data: sources } = useSources();


    const fetching = useIsFetching({ queryKey: [`${moduleSingle}/list`] }) > 0;

    const handleSearch = (filtersValues: InputItem[]) => {

        let newFilters: any = {};

        filtersValues.map(filter => {
            if (filter.value) newFilters[filter.key] = filter.value
        });
        setRequest({ ...request, page: 1, filters: newFilters });
    }

    const handlePaginationChange = (page: number) => {
        if (page <= 0) page = 1;
        setRequest({ ...request, page });
    }

    const handleChangePerPage = async (newPerPage: number, page: number) => {
        if (newPerPage == -1) newPerPage = 20;
        if (!firstTime && searchParams.get('view') == 'table') setRequest({ ...request, perPage: newPerPage, page: 1 });
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

    const columnsData = useMemo(() => {
        if (!stages || !data) return [];

        return stages.map((stage) => ({
            color: '',
            id: stage.value,
            title: stage.label,
            items: (data.data as Opportunity[]).filter(
                (item: Opportunity) => item.lead_status === stage.label
            ),
        }));
    }, [stages, data]);

    useEffect(() => {
        // Consolidar la lógica de actualización de request
        const view = searchParams.get('view');
        const newPerPage = view === 'kanban' ? -1 : 20;

        if (request.perPage !== newPerPage || request.page !== 1) {
            setRequest((prevRequest) => ({
                ...prevRequest,
                perPage: newPerPage,
                page: 1,
            }));
        }
    }, [searchParams]);

    useEffect(() => {
        const newFilters = [...tableFilters];

        newFilters.forEach((field) => {

            switch (field.key) {
                case 'assigned_to':
                    field.options = agents?.map((agent) => ({ label: agent.name, value: agent.id.toString() }));
                    field.isMultiSelect = true;
                    break;

                case 'lead_status':
                    field.options = stages;
                    field.isMultiSelect = true;
                    break;

                case 'lead_source':
                    field.options = sources;
                    field.isMultiSelect = true;
                    break;
            }
        });

        setFilters(newFilters);

        if (!firstTime) {
            queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/list`] });
        }

        setFirstTime(false);
    }, [JSON.stringify(request.filters), agents, request.perPage]);


    return (
        <ModuleContentWrapper>
            <TableFilters searchFn={handleSearch} filters={tableFilters} />

            {searchParams.get('view') == 'kanban'
                ? (columnsData.length && !fetching) ? <div className="mt-10 max-w-[90vw] "><DataKanban dataColumns={columnsData as Column<Opportunity>[]} /></div> : (fetching) ? 'loading...' : 'no records found'
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