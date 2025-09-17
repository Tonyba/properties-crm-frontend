import type { InputItem, Lead } from "../../helpers/types";
import TableFilters from "../../ui/table_filters/TableFilters"

import { leadFields } from "../../helpers/constants";
import { ModuleContentWrapper } from "../../components/wrappers";
import { useIsFetching, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";


import DataTable from 'react-data-table-component';
import { useLeadsList } from "../../hooks/useLeadsList";


const LeadList = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [firstTime, setFirstTime] = useState(true);

    const [leadRequest, setLeadRequest] = useState({
        perPage: 20,
        page: 1,
        filters: {} as Lead
    });

    const { data: leads } = useSuspenseQuery(useLeadsList(leadRequest, queryClient));
    const fetching = useIsFetching({ queryKey: ['leads', 'list'] }) > 0

    useEffect(() => {
        const invalidate = async () => {
            await queryClient.invalidateQueries({ queryKey: ['leads', 'list'] });
        };
        if (!firstTime) invalidate();
    }, [leadRequest.perPage]);

    const handleSearch = (filtersValues: InputItem[]) => {
        console.log(filtersValues)
    }

    const dataCols = leadFields.map(col => ({
        name: col.label,
        selector: (row: Lead) => row[col.key as keyof Lead] ?? ''
    }))

    const handlePaginationChange = (page: number) => {
        setLeadRequest({ ...leadRequest, page });
    }

    const handleChangePerPage = async (newPerPage: number, page: number) => {

        if (!firstTime) setLeadRequest({ ...leadRequest, perPage: newPerPage, page });
        setFirstTime(false);

    }

    const handleRowClick = (row: Lead) => {
        navigate(`./leads/${row.id}/edit`);
    }

    return (
        <ModuleContentWrapper>

            <TableFilters searchFn={handleSearch} filters={leadFields} />

            <DataTable
                columns={[...dataCols]}
                progressPending={fetching}
                responsive
                highlightOnHover
                pointerOnHover
                pagination
                paginationPerPage={leadRequest.perPage}
                paginationTotalRows={leads.recordsFiltered}
                paginationServer
                data={leads.data}
                onChangeRowsPerPage={handleChangePerPage}
                onChangePage={handlePaginationChange}
                onRowClicked={handleRowClick}
            />

        </ModuleContentWrapper>
    )
}

export default LeadList