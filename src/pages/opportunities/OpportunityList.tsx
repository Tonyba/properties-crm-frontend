import { opportunities_list } from "../../api/opportunities"
import DatableList from "../../components/Datatablelist"
import { opportunityFields } from "../../helpers/constants"
import type { Opportunity } from "../../helpers/types"

const dataCols = opportunityFields.map(col => ({
    name: col.label,
    selector: (row: Opportunity) => {
        const value = row[col.key as keyof Opportunity];
        if (Array.isArray(value) || value instanceof Date) {
            return value.toString();
        }
        return typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string' ? value : '';
    }
}))


const OpportunityList = () => {
    return <DatableList dataCols={dataCols} get_fn={opportunities_list} filterFields={opportunityFields} />

}

export default OpportunityList