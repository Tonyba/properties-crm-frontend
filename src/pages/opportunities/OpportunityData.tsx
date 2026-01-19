import { create_opportunity, edit_opportunity } from "@/api/opportunities";
import { Input, TextArea } from "@/components/InputForm";
import { fullOpportunityFields } from "@/helpers/constants";
import type { Opportunity, SelectOption } from "@/helpers/types";
import { useAgents } from "@/hooks/useAgents";
import { useGetSingle } from "@/hooks/useGetSingle";
import { useMutateSingle } from "@/hooks/useMutateSingle";
import { useTaxonomies } from "@/hooks/useTaxonomies";
import dayjs from "dayjs";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { CiEdit } from "react-icons/ci";
import { FaCheck, FaTimes } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { useServices } from "../../hooks/userServices";

import Select from 'react-select';
import { DatePicker } from "@mui/x-date-pickers";
import AsyncSelect from 'react-select/async';
import debounce from "lodash.debounce";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchByIdQueryOptions, useSearchByNameQueryOptions } from "@/hooks/useSearchByName";
import { useModuleHeader } from "@/hooks/useModuleHeader";
import { searchPropertyById } from "@/hooks/searchPropertyByName";

const OpportunityData = () => {

    const textAreaRef = useRef<HTMLTemplateElement>(null);
    const { data: agents } = useAgents();
    const { data: terms } = useTaxonomies('opportunity');
    const queryClient = useQueryClient();
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    const { data: dataItem } = useGetSingle({ updating: true });
    const [data, setData] = useState<Opportunity & { readonly: true }>(dataItem as Opportunity & { readonly: true });
    const [readOnlyFields, setReadOnlyFields] = useState(Object.keys(dataItem as Opportunity).map(key => ({ key, readonly: true, visible: false })));

    const [fields, setFields] = useState(fullOpportunityFields);
    const { data: services } = useServices();


    const { mutate } = useMutateSingle({
        createFn: create_opportunity,
        updateFn: edit_opportunity,
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
        setData({ ...data, [key]: data ? data[key as keyof Opportunity] : '' });
    }

    const [contacts, setContacts] = useState<SelectOption[]>([]);

    const saveChange = async () => {

        mutate({
            ...data,
            contact: data.contact.map((cont) => (cont as SelectOption).value),
            related_services: data.related_services?.map((serv) => (serv as SelectOption).value) ?? [],
        });
        setReadOnlyFields(readOnlyFields.map(val => ({ ...val, readonly: true, visible: false })));
    }

    const loadAsync = async (inputValue: string): Promise<SelectOption[]> => {
        if (inputValue.length < 3) return [];

        const data: any = await queryClient.fetchQuery(useSearchByNameQueryOptions(`search_by/${moduleSingle}/${inputValue}`, inputValue, queryClient));

        const props = Array.isArray(data)
            ? data.map((prop: any) => ({
                label: prop.title,
                value: prop.id.toString(),
            }))
            : [];


        setContacts(props);

        return props;
    };


    const debouncedLoadProperties = debounce(
        (inputValue: string, callback: (options: SelectOption[]) => void) => {
            loadAsync(inputValue).then(callback);
        },
        1000
    );

    useEffect(() => {

        const fetchServices = async () => {
            let finalData: { label: string, value: string }[] = [];

            if (data.related_services) {

                for (const service_id of data.related_services) {

                    const resp = await queryClient.fetchQuery(
                        searchPropertyById(service_id.toString(), queryClient)
                    );

                    const props = Array.isArray(resp)
                        ? resp.map((prop: any) => ({
                            label: prop.title,
                            value: prop.id.toString(),
                        }))
                        : []

                    finalData = finalData.concat(props);
                }
            }

            return finalData;
        }


        const getInitialData = async () => {

            let finalData: { label: string, value: string }[] = [];
            let servicesFinalData = [];

            for (const inputValue of data.contact) {
                const data: any = await queryClient.fetchQuery(useSearchByIdQueryOptions(`search_by/${moduleSingle}/${inputValue}`, inputValue.toString(), queryClient));
                const props = Array.isArray(data)
                    ? data.map((prop: any) => ({
                        label: prop.title,
                        value: prop.id.toString(),
                    }))
                    : [];
                finalData = finalData.concat(props);
            }

            servicesFinalData = await fetchServices();

            setData({ ...data, contact: finalData, related_services: servicesFinalData })
            setContacts(finalData);
        }

        getInitialData();

        return () => { }
    }, []);



    useEffect(() => {
        let newFields = [...fields];
        const taxs = Object.keys(terms ?? {});

        if (terms) taxs.map(tax => {
            const foundIndex = newFields.findIndex(field => field.key == tax);
            if (newFields[foundIndex]) newFields[foundIndex].options = terms[tax];
        })

        const related_services_index = newFields.findIndex(field => field.key == 'related_services')
        if (related_services_index != -1) {
            newFields[related_services_index].options = services?.map((service) => ({ label: service.title, value: service.id.toString() }))
        }

        const assigned_index = newFields.findIndex(field => field.key == 'assigned_to');
        if (assigned_index != -1) {
            newFields[assigned_index].options = agents?.map((agent) => ({ label: agent.name, value: agent.id.toString() }));
        }


        setFields(newFields);
        return () => { }
    }, [agents, terms, services]);


    const testing = (value: any) => {

        if (Array.isArray(value) && value.length > 0 && value[0].label) {
            return value;
        } else {
            return [];
        }

    }

    return (
        <>
            <h2 className="flex items-center gap-2 text-xl mb-2"><IoChevronDown /> Contact Details</h2>
            <form className="grid grid-cols-2 gap-y-5 gap-x-24">
                {fields.map(({ key, type, label, required, options, placeholder, isMultiSelect, isAsyncSelect, isClearable }) => (
                    <div className={`flex group relative justify-between ${type == 'textarea' ? 'col-span-2 flex flex-col' : ''}`} key={key}>
                        <label className={`text-sm ${type == 'textarea' ? 'flex items-center gap-2 text-xl mb-2' : ''}`} htmlFor={key}> {type == 'textarea' && <IoChevronDown />} {label} {required && <sup className="text-red-500 text-base translate-y-1.5 ml-1 inline-block">*</sup>}</label>
                        {
                            (type != 'select' && type != 'textarea' && type != 'datetimepicker' && type != 'checkbox') && <Input
                                type={type}
                                name={key}
                                placeholder={label}
                                id={key}
                                value={data?.[key as keyof Opportunity] ?? ""}
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
                            type == 'datetimepicker'
                            &&
                            <DatePicker className='w-1/2'
                                format="DD/MM/YYYY"
                                disabled={readOnlyFields.length ? readOnlyFields.find(field => field.key == key)?.readonly : true}
                                value={typeof data?.[key as keyof Opportunity] == 'string' ? dayjs(data?.[key as keyof Opportunity] as string) : data?.[key as keyof Opportunity] as dayjs.Dayjs}
                                onChange={(newValue) => {
                                    let newVal = { ...data };
                                    (newVal as any)[key] = newValue;
                                    setData(newVal);
                                }}
                                name={key} key={key} label={label} />
                        }


                        {
                            type == 'select' && isAsyncSelect && <AsyncSelect
                                className="w-1/2"
                                cacheOptions
                                key={key}
                                isClearable
                                isDisabled={readOnlyFields.length ? readOnlyFields.find(field => field.key == key)?.readonly : true}
                                isMulti={isMultiSelect}
                                defaultOptions={contacts}
                                placeholder={placeholder ?? label}
                                loadOptions={debouncedLoadProperties}
                                value={
                                    isMultiSelect
                                        ? testing((data as any)[key])
                                        : options?.find(option => option.value == (data as any)[key])
                                }
                                onChange={(selectedOption) => {

                                    let newVal = { ...data };
                                    if (Array.isArray(selectedOption)) {
                                        (newVal as any)[key] = selectedOption
                                    } else if (!Array.isArray(selectedOption) && selectedOption) {
                                        const selected = selectedOption as SelectOption;
                                        (newVal as any)[key] = selected.value;
                                    }

                                    setData(newVal);
                                }}
                            />
                        }

                        {
                            (type == 'select' && !isAsyncSelect) && (
                                <Select
                                    className="w-1/2"
                                    isClearable={isClearable}
                                    isMulti={isMultiSelect}
                                    isSearchable={false}
                                    key={key}
                                    isDisabled={readOnlyFields.length ? readOnlyFields.find(field => field.key == key)?.readonly : true}
                                    value={isMultiSelect
                                        ? testing((data as any)[key])
                                        : options?.find(option => option.value == (data as any)[key])}
                                    options={options ?? []}
                                    onChange={(selectedOption) => {

                                        let newVal = { ...data };
                                        if (Array.isArray(selectedOption)) {
                                            (newVal as any)[key as keyof Opportunity] = selectedOption;
                                        } else if (!Array.isArray(selectedOption) && selectedOption) {
                                            const selected = selectedOption as SelectOption;
                                            (newVal as any)[key as keyof Opportunity] = selected.value;
                                        }
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

export default OpportunityData