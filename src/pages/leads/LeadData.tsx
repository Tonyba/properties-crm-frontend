import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { IoChevronDown } from "react-icons/io5";
import { useParams } from "react-router";
import type { AddSelectsResponse, Lead, SelectOption } from "../../helpers/types";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { edit_lead } from "../../api/leads";
import { fullLeadFields } from "../../helpers/constants";
import { Input, TextArea } from "../../components/InputForm";
import { searchPropertyById, searchPropertyByName } from "../../hooks/searchPropertyByName";

import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce'
import { selectsLeadQuery } from "../../loaders/leadLoader";
import { formatData } from "../../helpers/helpers";
import { FaCheck, FaTimes } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

function LeadData() {

    const { leadId } = useParams();
    const queryClient = useQueryClient();
    const textAreaRef = useRef<HTMLTemplateElement>(null);

    const lead = queryClient.getQueryData<Lead>([`lead/${leadId}`]);

    const { data: { data } } = useSuspenseQuery(selectsLeadQuery());

    const selectData = data;

    const [leadData, setLeadData] = useState<Lead & { readonly: true }>(lead as Lead & { readonly: true });
    const [readOnlyFields, setReadOnlyFields] = useState(Object.keys(lead as Lead).map(key => ({ key, readonly: true, visible: false })));

    const [properties, setProperties] = useState<SelectOption[]>([]);

    const loadProperties = async (inputValue: string): Promise<SelectOption[]> => {
        if (inputValue.length < 3) return [];
        // Use React Query's fetchQuery to get fresh data for this input
        const data = await queryClient.fetchQuery(
            searchPropertyByName(inputValue, queryClient)
        );

        const props = Array.isArray(data)
            ? data.map((prop: any) => ({
                label: prop.title,
                value: prop.id.toString(),
            }))
            : []

        setProperties(props);

        return props;
    };

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
        setLeadData({ ...leadData, [key]: lead ? lead[key as keyof Lead] : '' });
    }

    const saveChange = async () => {
        mutate(leadData);
        setReadOnlyFields(readOnlyFields.map(val => ({ ...val, readonly: true, visible: false })));
    }

    const debouncedLoadProperties = debounce(
        (inputValue: string, callback: (options: SelectOption[]) => void) => {
            loadProperties(inputValue).then(callback);
        },
        1000
    );


    const { status, error, mutate } = useMutation({
        mutationFn: edit_lead,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['leads', 'list'] });
            await queryClient.invalidateQueries({ queryKey: [`lead/${leadId}`] });
        },
        onMutate: async (newLead: Lead) => {
            await queryClient.cancelQueries({ queryKey: [`lead/${leadId}`] });
            queryClient.setQueryData([`lead/${leadId}`], () => (newLead));
            return lead;
        },
        onError: () => {
            console.log('some error')
        }
    });


    useEffect(() => {
        const fetchProperties = async () => {
            if (leadData.requested_property) {
                const data = await queryClient.fetchQuery(
                    searchPropertyById(leadData.requested_property, queryClient)
                );

                const props = Array.isArray(data)
                    ? data.map((prop: any) => ({
                        label: prop.title,
                        value: prop.id.toString(),
                    }))
                    : []

                setProperties(props);
            }
        };
        fetchProperties();
    }, []);

    return (
        <>
            <h2 className="flex items-center gap-2 text-xl mb-2"><IoChevronDown /> Lead Details</h2>
            <form className="grid grid-cols-2 gap-y-5 gap-x-24">
                {fullLeadFields.map(({ key, type, label, required, options }) => (
                    <div className={`flex group relative justify-between ${type == 'textarea' ? 'col-span-2 flex flex-col' : ''}`} key={key}>
                        <label className={`text-sm ${type == 'textarea' ? 'flex items-center gap-2 text-xl mb-2' : ''}`} htmlFor={key}> {type == 'textarea' && <IoChevronDown />} {label} {required && <sup className="text-red-500 text-base translate-y-1.5 ml-1 inline-block">*</sup>}</label>
                        {
                            (type != 'select' && type != 'textarea') && <Input
                                type={type}
                                name={key}
                                placeholder={label}
                                id={key}
                                value={leadData?.[key as keyof Lead] ?? ""}
                                className='w-1/2'
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const currentVal = e.target.value;
                                    let newVal = { ...leadData };
                                    (newVal as any)[key] = currentVal;
                                    setLeadData(newVal);
                                }}
                            />
                        }
                        {
                            type == 'select' && (
                                key == 'requested_property' ?
                                    <AsyncSelect
                                        className="w-1/2"
                                        cacheOptions
                                        isClearable
                                        defaultOptions={properties}
                                        isDisabled={readOnlyFields.length ? readOnlyFields.find(field => field.key == key)?.readonly : true}
                                        loadOptions={debouncedLoadProperties}
                                        value={leadData?.[key as keyof Lead]
                                            ? { label: properties.find(prop => prop.value == leadData[key as keyof Lead])?.label, value: leadData[key as keyof Lead] } as SelectOption
                                            : null}
                                        onChange={(selectedOption) => {
                                            let newVal = { ...leadData };
                                            (newVal as any)[key] = (selectedOption as SelectOption)?.value;
                                            setLeadData(newVal);
                                        }}
                                    />
                                    : <Select
                                        className="w-1/2"
                                        isDisabled={readOnlyFields.length ? readOnlyFields.find(field => field.key == key)?.readonly : true}
                                        isClearable={key == 'assigned_to' ? false : true}
                                        options={selectData[key as keyof AddSelectsResponse] ? formatData(selectData, key, options) : options}
                                        value={leadData?.[key as keyof Lead]
                                            ? {
                                                label: selectData[key as keyof AddSelectsResponse].find(item => item.term_id.toString() == leadData[key as keyof Lead])?.name || options?.find(opt => opt.value == leadData[key as keyof Lead])?.label || String(leadData[key as keyof Lead]),
                                                value: leadData[key as keyof Lead]
                                            } as SelectOption
                                            : null}
                                        onChange={(selectedOption) => {
                                            let newVal = { ...leadData };
                                            (newVal as any)[key] = (selectedOption as SelectOption)?.value;
                                            setLeadData(newVal);
                                        }}
                                    />
                            )
                        }

                        {
                            type == 'textarea' && <TextArea key={key} name={key} id={key} ref={textAreaRef} value={leadData.description} className="w-[76%]" onClick={() => {
                                if (textAreaRef.current) textAreaRef.current.style.height = '275px'
                            }} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const currentVal = e.target.value;
                                let newVal = { ...leadData };
                                (newVal as any)[key] = currentVal;
                                setLeadData(newVal);
                            }}></TextArea>
                        }

                        {
                            (!readOnlyFields.find(field => field.key == key)?.visible && !readOnlyFields.some(field => field.visible == true)) && <button onClick={() => handleEditBtn(key)} className="invisible group-hover:visible  cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 bg-white p-1"><CiEdit /></button>
                        }

                        {
                            readOnlyFields.find(field => field.key == key)?.visible && <div className="flex gap-1 absolute right-3 top-1/2 -translate-y-1/2 text-white text-xs">
                                <button onClick={() => saveChange()} className="cursor-pointer text-green-600 p-1 bg-white"> <FaCheck /> </button>
                                <button onClick={() => handleCancel(key)} className="cursor-pointer text-red-600 p-1 bg-white"> <FaTimes /> </button>
                            </div>
                        }

                    </div>
                ))}

            </form>
        </>
    )
}

export default LeadData