import { useEffect, useState, type ChangeEvent } from "react";
import { Input, TextArea } from "../../components/InputForm";
import { ModuleContentWrapper } from "../../components/wrappers";

import Select from 'react-select';

import { SaveBottomBar } from "../../components/SaveBottomBar";
import type { Contact, SelectOption } from "../../helpers/types";
import { useAgents } from "../../hooks/useAgents";
import { fullContactFields } from "../../helpers/constants";
import { useMutateSingle } from "../../hooks/useMutateSingle";
import { create_contact, edit_contact, get_contact } from "../../api/contacts";
import { useTaxonomies } from "../../hooks/useTaxonomies";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGetSingleSuspense } from "../../hooks/useGetSingle";

const defaultData = {} as Contact;
const isEditing = window.location.href.includes('edit');

export const AddContact = () => {


    const { data: dataItem } = useSuspenseQuery(useGetSingleSuspense(get_contact, true));
    const initData = dataItem as Contact;
    const [fields, setFields] = useState(fullContactFields);

    const { data: agents } = useAgents();
    const { data: terms } = useTaxonomies('contact');

    const { mutate, status } = useMutateSingle({
        createFn: create_contact,
        updateFn: edit_contact,
        isEditing
    });

    const [data, setData] = useState<Contact>(initData ?? defaultData);

    const handleSave = () => {
        mutate(data);
    }



    useEffect(() => {
        let newFields = [...fields];
        const taxs = Object.keys(terms ?? {});

        if (terms) taxs.map(tax => {
            const foundIndex = newFields.findIndex(field => field.key == tax);
            if (newFields[foundIndex]) newFields[foundIndex].options = terms[tax];
        })

        const assigned_index = newFields.findIndex(field => field.key == 'assigned_to');
        if (assigned_index != -1) {
            newFields[assigned_index].options = agents?.map((agent) => ({ label: agent.name, value: agent.id.toString() }));
        }

        setFields(newFields);
        return () => { }
    }, [agents, terms]);

    return (
        <ModuleContentWrapper>
            <h1 className="mb-5">Contact Details</h1>

            <form className="grid grid-cols-2 gap-y-5 gap-x-24" >
                {fields.map(({ key, type, label, required, options, placeholder, isClearable }) => (
                    <div className={`flex justify-between ${type == 'textarea' ? 'col-span-2' : ''}`} key={key}>
                        <label className="text-sm" htmlFor={key}> {label} {required && <sup className="text-red-500 text-base translate-y-1.5 ml-1 inline-block">*</sup>}</label>
                        {
                            (type != 'select' && type != 'textarea' && type != 'checkbox' && type != 'datetimepicker') && <Input
                                type={type}
                                name={key}
                                placeholder={label}
                                id={key}
                                value={data?.[key as keyof Contact] ?? ""}
                                className='w-1/2'
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const currentVal = e.target.value;
                                    let newVal = { ...data };
                                    (newVal as any)[key] = currentVal;
                                    setData(newVal);
                                }}
                            />
                        }

                        {
                            type == 'datetimepicker' && <Input
                                name={key} id={key}
                                placeholder={placeholder ?? label}
                                aria-label={label}
                                className='w-1/2'
                                value={data?.[key as keyof Contact]}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const currentVal = e.target.value;

                                    let newVal = { ...data };
                                    (newVal as any)[key] = currentVal;
                                    setData(newVal);
                                }}
                                type="date" />

                        }

                        {
                            type == 'checkbox' && <div key={key} className="w-1/2" ><input checked={data[key as keyof Contact] as boolean} type={type} name={key} id={key} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                let newVal = { ...data };
                                (newVal as any)[key] = e.target.checked;
                                setData(newVal);
                            }} /></div>
                        }

                        {
                            type == 'select' && (
                                <Select
                                    className="w-1/2"
                                    isClearable={isClearable}
                                    isSearchable={false}
                                    value={options?.find(opt => opt.value == data[key as keyof Contact])}
                                    options={options ?? []}
                                    onChange={(selectedOption) => {
                                        let newVal = { ...data };
                                        (newVal as any)[key] = (selectedOption as SelectOption)?.value;
                                        setData(newVal);
                                    }}
                                />
                            )
                        }

                        {
                            type == 'textarea' && <TextArea key={key} name={key} id={key} value={data.description} className="w-[76%]" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const currentVal = e.target.value;
                                let newVal = { ...data };
                                (newVal as any)[key] = currentVal;
                                setData(newVal);
                            }}></TextArea>
                        }



                    </div>
                ))}
            </form>

            <SaveBottomBar isLoading={status == 'pending'} onSubmit={handleSave} />
        </ModuleContentWrapper>
    )
}

export default AddContact;