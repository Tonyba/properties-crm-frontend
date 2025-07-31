import type { FilterItem } from "../../helpers/types";
import TableFilters from "../../ui/table_filters/TableFilters"
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';

DataTable.use(DT);

const filters: FilterItem[] = [
    {
        key: 'first_name',
        label: 'First Name',
        type: 'text'
    },
    {
        key: 'last_name',
        label: 'Last Name',
        type: 'text'
    },
    {
        key: 'company',
        label: 'Company',
        type: 'text'
    },
    {
        key: 'phone',
        label: 'Phone',
        type: 'text'
    },
    {
        key: 'website',
        label: 'Website',
        type: 'text'
    },
    {
        key: 'email',
        label: 'Email',
        type: 'text'
    },
    {
        key: 'assigned_to',
        label: 'Assigned To',
        type: 'select'
    },
];

const LeadList = () => {

    const handleSearch = (filters: FilterItem[]) => {
        console.log(filters)
    }

    const dataCols = filters.map(filter => ({ data: filter.key }));

    return (
        <div className="p-3">

            <TableFilters searchFn={handleSearch} filters={filters} />

            <DataTable
                options={{
                    searching: false,
                    ordering: false,
                    lengthMenu: [10, 15, 20, 50, 100],
                    pageLength: 20
                }}
                columns={dataCols} >
                <thead>
                    <tr>
                        {filters.map(filter => (
                            <th>{filter.label}</th>
                        ))}
                    </tr>
                </thead>
            </DataTable>

        </div>
    )
}

export default LeadList