import type { InputItem } from "../../helpers/types";
import TableFilters from "../../ui/table_filters/TableFilters"
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { leadFields } from "../../helpers/constants";
import { ModuleContentWrapper } from "../../components/wrappers";

DataTable.use(DT);



const LeadList = () => {

    const handleSearch = (filters: InputItem[]) => {
        console.log(filters)
    }

    const dataCols = leadFields.map(filter => ({ data: filter.key }));

    return (
        <ModuleContentWrapper>

            <TableFilters searchFn={handleSearch} filters={leadFields} />

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
                        {leadFields.map(filter => (
                            <th key={filter.label}>{filter.label}</th>
                        ))}
                    </tr>
                </thead>
            </DataTable>

        </ModuleContentWrapper>
    )
}

export default LeadList