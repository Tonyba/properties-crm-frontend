import type { Email, InputItem } from '@/helpers/types';
import { useEmails } from '@/hooks/useEmails';
import { useModuleHeader } from '@/hooks/useModuleHeader';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import DataTable, { type TableColumn } from 'react-data-table-component';
import TableFilters from '@/ui/table_filters/TableFilters';
import { emailFilterFields } from '@/helpers/constants';


const dataCols: TableColumn<Email>[] = emailFilterFields.map(col => ({
    name: col.label,
    selector: (row: Email) => {
        const value = row[col.key as keyof Email];
        if (value instanceof Date) {
            return value.toLocaleString();
        }
        if (typeof value === 'object' && value !== null && 'toString' in value) {
            // Handles DateValue or similar objects
            return value.toString();
        }
        return value ?? '';
    },
    maxWidth: '400px'
}))


const EmailsTab = () => {

    const queryClient = useQueryClient();
    const [request, setRequest] = useState({
        perPage: 20,
        page: 1,
        filters: {} as Email
    });

    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();
    const [firstTime, setFirstTime] = useState(true);
    const [fields, setFields] = useState(emailFilterFields);

    const { id } = useParams();

    const { data: emails, isPending } = useEmails<Email>({ ...request, id: id ?? '0' });

    const handleSearch = (filtersValues: InputItem[]) => {

        let newFilters: any = {};

        filtersValues.map(filter => {
            if (filter.value) newFilters[filter.key] = filter.value
        });

        setRequest({ ...request, page: 1, filters: newFilters });
    }


    const handleChangePerPage = async (newPerPage: number, page: number) => {
        if (!firstTime) setRequest({ ...request, perPage: newPerPage, page });
        setFirstTime(false);
    }


    const handlePaginationChange = (page: number) => {
        setRequest({ ...request, page });
    }

    const handleRowClick = (row: any) => {
        //  navigate(`./leads/
        // ${row.id}/details`);
        console.log(row)
    }


    useEffect(() => {

        const invalidate = async () => {
            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}-emails/detail/${id}/list`] });
        };
        if (!firstTime) invalidate();

    }, [request.perPage, JSON.stringify(request.filters)]);

    return <div >

        <TableFilters searchFn={handleSearch} filters={fields} />

        <DataTable
            columns={dataCols}
            progressPending={isPending}
            responsive
            highlightOnHover
            pointerOnHover
            pagination
            paginationPerPage={request.perPage}
            paginationTotalRows={emails?.recordsFiltered}
            paginationServer
            data={emails?.data ?? []}
            onChangeRowsPerPage={handleChangePerPage}
            onChangePage={handlePaginationChange}
            onRowClicked={handleRowClick}
        />
    </div>
}

export default EmailsTab