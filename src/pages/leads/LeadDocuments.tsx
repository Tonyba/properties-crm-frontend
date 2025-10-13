import { useQueryClient } from "@tanstack/react-query";
import { useAgents } from "../../hooks/useAgents";
import { useEffect, useState } from "react";

import DataTable from 'react-data-table-component';
import TableFilters from "../../ui/table_filters/TableFilters";

import type { Document, InputItem } from "../../helpers/types";
import { DocumentUploadFormFields } from "../../helpers/constants";
import { useDocumentsList } from "../../hooks/useDocumentsList";
import { escapeHtml } from "../../helpers/helpers";
import { DocumentsActions } from "../../components/tableActions/DocumentsActions";
import { useParams } from "react-router";
import { useModuleHeader } from "../../hooks/useModuleHeader";


const documentFields = DocumentUploadFormFields.map(field => {

    if (
        field.type == 'select'
    ) {
        field.isMultiSelect = true
    }

    return field;
}).filter(item => item.isFilterField);

const dataCols = documentFields.map(col => ({
    name: col.label,
    selector: (row: Document) => row[col.key as keyof Document] ?? '' as any
}))

const LeadDocuments = () => {

    const queryClient = useQueryClient();
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    const { id } = useParams();

    const [request, setRequest] = useState({
        perPage: 20,
        page: 1,
        filters: {} as Document
    });

    const [fields, setFields] = useState(documentFields);

    const { data: docs, isPending } = useDocumentsList<Document>(request);


    const { data: agents } = useAgents();
    const [firstTime, setFirstTime] = useState(true);


    const handleSearch = (filtersValues: InputItem[]) => {

        console.log(filtersValues)

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
        //  navigate(`./leads/
        // ${row.id}/details`);
    }

    useEffect(() => {

        const newFields = [...fields];
        const assigned_index = newFields.findIndex(field => field.key == 'assigned_to');

        if (assigned_index != -1 && agents) {
            newFields[assigned_index].options = agents?.map((agent) => ({ label: agent.name, value: agent.id.toString() }));
        }

        const invalidate = async () => {
            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}-docs/detail/${id}/list`] });
        };
        if (!firstTime) invalidate();

        setFields(newFields);

        return () => { }

    }, [request.perPage, JSON.stringify(request.filters), agents]);

    return (
        <>
            <TableFilters searchFn={handleSearch} filters={fields} />

            <DataTable
                columns={[{
                    name: 'Actions',
                    cell: (row: any) => (
                        <DocumentsActions {...row} delete={true} />
                    ),
                }, ...dataCols]}
                progressPending={isPending}
                responsive
                highlightOnHover
                pointerOnHover
                pagination
                paginationPerPage={request.perPage}
                paginationTotalRows={docs?.recordsFiltered}
                paginationServer
                data={docs?.data.map((val) => ({ ...val, title: escapeHtml(val.title) })) ?? []}
                onChangeRowsPerPage={handleChangePerPage}
                onChangePage={handlePaginationChange}
                onRowClicked={handleRowClick}
            />
        </>
    )
}

export default LeadDocuments