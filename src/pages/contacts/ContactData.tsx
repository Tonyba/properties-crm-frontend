import { IoChevronDown } from "react-icons/io5";
import type { Contact, SelectOption } from "../../helpers/types";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { fullContactFields } from "../../helpers/constants";
import { Input, TextArea } from "../../components/InputForm";

import Select from 'react-select';
import { FaCheck, FaTimes } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { useGetSingle } from "../../hooks/useGetSingle";
import { useMutateSingle } from "../../hooks/useMutateSingle";
import { create_contact, edit_contact } from "../../api/contacts";
import { useAgents } from "../../hooks/useAgents";
import { useTaxonomies } from "../../hooks/useTaxonomies";
import moment from "moment";


const ContactData = () => {


    const textAreaRef = useRef<HTMLTemplateElement>(null);


    const { data: agents } = useAgents();
    const { data: terms } = useTaxonomies('contact');

    const { data: dataItem } = useGetSingle({ updating: true });

    const [data, setData] = useState<Contact & { readonly: true }>(dataItem as Contact & { readonly: true });
    const [readOnlyFields, setReadOnlyFields] = useState(Object.keys(dataItem as Contact).map(key => ({ key, readonly: true, visible: false })));

    const [fields, setFields] = useState(fullContactFields);

    const { mutate } = useMutateSingle({
        createFn: create_contact,
        updateFn: edit_contact,
        isEditing: true
    });

    const handleEditBtn = (key: string) => {

        const selected = readOnlyFields.findIndex(field => field.key == key);
        let newVal = [...readOnlyFields];

        newVal = newVal.map(val => ({ ...val, readonly: true, visible: false }));
        newVal[selected].visible = true;
        newVal[selected].readonly = false;
        setReadOnlyFields(newVal);
    }

    const handleCancel = (key: string) => {
        let newVal = [...readOnlyFields];
        newVal = newVal.map(val => ({ ...val, readonly: true, visible: false }));
        setReadOnlyFields(newVal);
        setData({ ...data, [key]: data ? data[key as keyof Contact] : '' });
    }

    const saveChange = async () => {
        mutate(data);
        setReadOnlyFields(readOnlyFields.map(val => ({ ...val, readonly: true, visible: false })));
    }

    const stringToDate = (_date: string, _format: string, _delimiter: string) => {
        var formatLowerCase = _format.toLowerCase();
        var formatItems = formatLowerCase.split(_delimiter);
        var dateItems = _date.split(_delimiter) as [];
        var monthIndex = formatItems.indexOf("mm");
        var dayIndex = formatItems.indexOf("dd");
        var yearIndex = formatItems.indexOf("yyyy") as number;
        var month = parseInt(dateItems[monthIndex]);
        month -= 1;
        var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
        return formatedDate;
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
        <>
            <h2 className="flex items-center gap-2 text-xl mb-2"><IoChevronDown /> Contact Details</h2>
            <form className="grid grid-cols-2 gap-y-5 gap-x-24">
                {fields.map(({ key, type, label, required, options, placeholder }) => (
                    <div className={`flex group relative justify-between ${type == 'textarea' ? 'col-span-2 flex flex-col' : ''}`} key={key}>
                        <label className={`text-sm ${type == 'textarea' ? 'flex items-center gap-2 text-xl mb-2' : ''}`} htmlFor={key}> {type == 'textarea' && <IoChevronDown />} {label} {required && <sup className="text-red-500 text-base translate-y-1.5 ml-1 inline-block">*</sup>}</label>
                        {
                            (type != 'select' && type != 'textarea' && type != 'datetimepicker' && type != 'checkbox') && <Input
                                type={type}
                                name={key}
                                placeholder={label}
                                id={key}
                                value={data?.[key as keyof Contact] ?? ""}
                                readOnly={readOnlyFields.length ? readOnlyFields.find(field => field.key == key)?.readonly : true}
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
                                readOnly={readOnlyFields.length ? readOnlyFields.find(field => field.key == key)?.readonly : true}
                                className='w-1/2'
                                value={data[key as keyof Contact] as string}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const currentVal = e.target.value;

                                    let newVal = { ...data };
                                    (newVal as any)[key] = currentVal;
                                    setData(newVal);
                                }}
                                type="date" />

                        }
                        {
                            type == 'checkbox' && <div key={key} className="w-1/2 border-b-1 border-gray-200 text-sm py-1 focus:border-blue-500 focus-visible:outline-0 " >

                                {
                                    readOnlyFields.find(field => field.key == key)?.readonly
                                        ? <>{data[key as keyof Contact] as boolean ? 'Yes' : 'No'}</>
                                        : <input checked={data[key as keyof Contact] as boolean} type={type} name={key} id={key} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            let newVal = { ...data };
                                            (newVal as any)[key] = e.target.checked;
                                            setData(newVal);
                                        }} />

                                }





                            </div>



                        }
                        {
                            type == 'select' && (
                                <Select
                                    className="w-1/2"
                                    isDisabled={readOnlyFields.length ? readOnlyFields.find(field => field.key == key)?.readonly : true}
                                    isClearable={key == 'assigned_to' ? false : true}
                                    options={options ?? []}
                                    value={options?.find(opt => opt.value == data[key as keyof Contact])}
                                    onChange={(selectedOption) => {
                                        let newVal = { ...data };
                                        (newVal as any)[key] = (selectedOption as SelectOption)?.value;
                                        setData(newVal);
                                    }}
                                />
                            )
                        }

                        {
                            type == 'textarea' && <TextArea key={key} name={key} id={key} ref={textAreaRef} value={data.description} className="w-[76%]" onClick={() => {
                                if (textAreaRef.current) textAreaRef.current.style.height = '275px'
                            }} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const currentVal = e.target.value;
                                let newVal = { ...data };
                                (newVal as any)[key] = currentVal;
                                setData(newVal);
                            }}></TextArea>
                        }

                        {
                            (!readOnlyFields.find(field => field.key == key)?.visible && !readOnlyFields.some(field => field.visible == true)) && <button type="button" onClick={() => handleEditBtn(key)} className="invisible group-hover:visible  cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 bg-white p-1"><CiEdit /></button>
                        }

                        {
                            readOnlyFields.find(field => field.key == key)?.visible && <div className="flex gap-1 absolute right-3 top-1/2 -translate-y-1/2 text-white text-xs">
                                <button type="button" onClick={() => saveChange()} className="cursor-pointer text-green-600 p-1 bg-white"> <FaCheck /> </button>
                                <button type="button" onClick={() => handleCancel(key)} className="cursor-pointer text-red-600 p-1 bg-white"> <FaTimes /> </button>
                            </div>
                        }

                    </div>
                ))}

            </form>
        </>
    )
}

export default ContactData;