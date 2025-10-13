import TableFilters from "../../ui/table_filters/TableFilters"

import DataTable from 'react-data-table-component';
import { useAgents } from "../../hooks/useAgents";

import { useEffect, useState } from "react";
import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import type { Contact, InputItem } from "../../helpers/types";
import { useModuleHeader } from "../../hooks/useModuleHeader";
import { useNavigate } from "react-router";
import { ModuleContentWrapper } from "../../components/wrappers";
import { useSingleList } from "../../hooks/useSingleList";
import { contacts_list } from "../../api/contacts";
import { contactFilterFields } from "../../helpers/constants";

const dataCols = contactFilterFields.map(col => ({
    name: col.label,
    selector: (row: Contact) => row[col.key as keyof Contact] ?? ''
}))

const ContactList = () => {

    const navigate = useNavigate();
    const [tableFilters, setFilters] = useState(contactFilterFields);
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();
    const queryClient = useQueryClient();
    const [firstTime, setFirstTime] = useState(true);
    const [request, setRequest] = useState({
        perPage: 20,
        page: 1,
        filters: {} as Contact
    });
    const { data: agents } = useAgents();

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

    const handleRowClick = (row: Contact) => {
        navigate(`./${row.id}/details`);
    }


    const { data } = useSingleList(request, contacts_list);

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

    }, [request.perPage, JSON.stringify(request.filters), agents]);

    return (
        <ModuleContentWrapper>
            <TableFilters searchFn={handleSearch} filters={tableFilters} />

            <DataTable
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

        </ModuleContentWrapper>
    )
}

export default ContactList;