import type { Contact } from "../../helpers/types";
import { contacts_list } from "../../api/contacts";
import { contactFilterFields } from "../../helpers/constants";
import DatableList from "../../components/Datatablelist";

const dataCols = contactFilterFields.map(col => ({
    name: col.label,
    selector: (row: Contact) => row[col.key as keyof Contact] ?? ''
}))

const ContactList = () => {
    return <DatableList dataCols={dataCols} get_fn={contacts_list} filterFields={contactFilterFields} />
}

export default ContactList;