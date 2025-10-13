import { useQueryClient } from "@tanstack/react-query";
import { useAgents } from "../../hooks/useAgents";
import { useEffect, useState } from "react";
import { EventFormFields } from "../../helpers/constants";
import { useActivitiesList } from "../../hooks/useActivitiesList";
import { useNavigate, useParams } from "react-router";
import DataTable from 'react-data-table-component';
import TableFilters from "../../ui/table_filters/TableFilters";
import { useTaxonomies } from "../../hooks/useTaxonomies";
import type { Event, InputItem } from "../../helpers/types";
import { ActivitiesAction } from "../../components/tableActions/ActivitiesAction";

const eventFields = EventFormFields.map(field => {

    if (
        field.type == 'select'
    ) {
        field.isMultiSelect = true
    }

    return field;
});


const dataCols = eventFields.map(col => ({
    name: col.label,
    selector: (row: Event) => row[col.key as keyof Event] ?? '' as any
}))

const LeadActivities = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [fields, setFields] = useState(eventFields);

    const { id } = useParams();
    const { data: taxonomies } = useTaxonomies('event');


    const { data: agents } = useAgents();
    const [firstTime, setFirstTime] = useState(true);

    const [request, setRequest] = useState({
        perPage: 20,
        page: 1,
        filters: {} as Event
    });

    const { data: activities, isPending } = useActivitiesList<Event>(request);

    const handlePaginationChange = (page: number) => {
        setRequest({ ...request, page });
    }

    const handleChangePerPage = async (newPerPage: number, page: number) => {
        if (!firstTime) setRequest({ ...request, perPage: newPerPage, page });
        setFirstTime(false);
    }

    const handleRowClick = (row: Event) => {
        //  navigate(`./leads/
        // ${row.id}/details`);
    }

    const handleSearch = (filtersValues: InputItem[]) => {
        let newFilters: any = {};

        filtersValues.map(filter => {
            if (filter.value) newFilters[filter.key] = filter.value
        });

        const findTaskIndex = newFilters['event_type']?.findIndex((type: string) => type == 'task');

        if (findTaskIndex != -1 && findTaskIndex != undefined) {
            newFilters['event_type']?.splice(findTaskIndex, 1);
            if (newFilters['event_type']?.length == 0) delete newFilters['event_type'];
            newFilters['selected_types'] = 'task';
        }

        setRequest({ ...request, page: 1, filters: newFilters });
    }

    useEffect(() => {

        const newFields = [...fields];
        const assigned_index = newFields.findIndex(field => field.key == 'assigned_to');
        const event_type_index = newFields.findIndex(field => field.key == 'event_type');


        if (assigned_index != -1 && agents) {
            newFields[assigned_index].options = agents?.map((agent) => ({ label: agent.name, value: agent.id.toString() }));
        }

        if (taxonomies) {
            const taxs = Object.keys(taxonomies);
            taxs.map(tax => {
                const foundIndex = newFields.findIndex(field => field.key == tax);
                if (newFields[foundIndex]) newFields[foundIndex].options = taxonomies[tax];
            })
        }


        if (event_type_index != 1) {
            const found = newFields[event_type_index].options?.find(opt => opt.value == 'task');
            if (!found) newFields[event_type_index].options?.push({ label: 'Task', value: 'task' });
        }

        const invalidate = async () => {
            await queryClient.invalidateQueries({ queryKey: [`leads/${id}/detail/list`] });
        };
        if (!firstTime) invalidate();


        setFields(newFields);

        return () => { }

    }, [request.perPage, JSON.stringify(request.filters), taxonomies, agents]);

    return (
        <>
            <TableFilters searchFn={handleSearch} filters={fields} />

            <DataTable
                columns={[{
                    name: 'Actions',
                    cell: (row: any) => (<ActivitiesAction item={row} />),
                }, ...dataCols]}
                progressPending={isPending}
                responsive
                highlightOnHover
                pointerOnHover
                pagination
                paginationPerPage={request.perPage}
                paginationTotalRows={activities?.recordsFiltered}
                paginationServer
                data={activities?.data ?? []}
                onChangeRowsPerPage={handleChangePerPage}
                onChangePage={handlePaginationChange}
                onRowClicked={handleRowClick}
            />
        </>

    )
}

export default LeadActivities