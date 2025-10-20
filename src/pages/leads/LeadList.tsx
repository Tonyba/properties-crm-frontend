import type { Lead } from "../../helpers/types";
import { leadFields } from "../../helpers/constants";
import DatableList from "../../components/Datatablelist";
import { leads_list } from "../../api/leads";

const dataCols = leadFields.map(col => ({
    name: col.label,
    selector: (row: Lead) => row[col.key as keyof Lead] ?? ''
}))

const LeadList = () => {
    return <DatableList dataCols={dataCols} get_fn={leads_list} filterFields={leadFields} />
}

export default LeadList