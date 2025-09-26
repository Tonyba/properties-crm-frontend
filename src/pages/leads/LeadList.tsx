import { type InputItem, type Lead } from "../../helpers/types";
import TableFilters from "../../ui/table_filters/TableFilters"

import { leadFields } from "../../helpers/constants";
import { ModuleContentWrapper } from "../../components/wrappers";
import { useIsFetching, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";


import DataTable from 'react-data-table-component';
import { useLeadsList } from "../../hooks/useLeadsList";
import { useAgents } from "../../hooks/useAgents";

const dataCols = leadFields.map(col => ({
    name: col.label,
    selector: (row: Lead) => row[col.key as keyof Lead] ?? ''
}))

const LeadList = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: agents } = useAgents(queryClient);

    leadFields.map(field => {
        if (field.key == 'assigned_to') {
            field.options = agents?.map(agent => ({ label: agent.name, value: agent.id.toString() }));
            field.isMultiSelect = true;
        }
    });

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
    }, [leadRequest.perPage, JSON.stringify(leadRequest.filters)]);

    const handleSearch = (filtersValues: InputItem[]) => {

        let newFilters: any = {};

        filtersValues.map(filter => {
            if (filter.value) newFilters[filter.key] = filter.value
        });

        setLeadRequest({ ...leadRequest, page: 1, filters: newFilters });
    }

    const handlePaginationChange = (page: number) => {
        setLeadRequest({ ...leadRequest, page });
    }

    const handleChangePerPage = async (newPerPage: number, page: number) => {
        if (!firstTime) setLeadRequest({ ...leadRequest, perPage: newPerPage, page });
        setFirstTime(false);
    }

    const handleRowClick = (row: Lead) => {
        navigate(`./leads/${row.id}/details`);
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