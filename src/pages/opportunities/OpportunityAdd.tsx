import { useEffect, useState, type ChangeEvent } from "react";
import { Input, TextArea } from "../../components/InputForm";
import { ModuleContentWrapper } from "../../components/wrappers";

import Select from 'react-select';
import AsyncSelect from 'react-select/async';

import debounce from 'lodash.debounce'

import { SaveBottomBar } from "../../components/SaveBottomBar";
import type { Opportunity, SelectOption } from "../../helpers/types";
import { useAgents } from "../../hooks/useAgents";
import { fullOpportunityFields } from "../../helpers/constants";
import { useMutateSingle } from "../../hooks/useMutateSingle";
import { useTaxonomies } from "../../hooks/useTaxonomies";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useGetSingleSuspense } from "../../hooks/useGetSingle";
import { create_opportunity, edit_opportunity, get_opportunity } from "../../api/opportunities";


import { FormFields } from "../../components/FormFields";
import { useModuleHeader } from "../../hooks/useModuleHeader";
import { useSearchByIdQueryOptions, useSearchByNameQueryOptions } from "../../hooks/useSearchByName";
import { useServices } from "../../hooks/userServices";

import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";

const defaultData = {} as Opportunity;
const isEditing = window.location.href.includes('edit');

export const OpportunityAdd = () => {

    const queryClient = useQueryClient();
    const { data: dataItem } = useSuspenseQuery(useGetSingleSuspense(get_opportunity, true));

    const initData = dataItem as Opportunity | undefined;

    const [fields, setFields] = useState(fullOpportunityFields);
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    const { data: agents } = useAgents();
    const { data: terms } = useTaxonomies('opportunity');
    const { data: services } = useServices();

    const [contacts, setContacts] = useState<SelectOption[]>([]);

    const { mutate, status } = useMutateSingle({
        createFn: create_opportunity,
        updateFn: edit_opportunity,
        isEditing
    });

    const [data, setData] = useState<Opportunity>(initData ? { ...initData, close_date: initData.close_date ? dayjs(initData.close_date as string) : dayjs() } : defaultData);

    const handleSave = () => {
        mutate({
            ...data,
            contact: data.contact.map((cont) => (cont as SelectOption).value),
            close_date: data.close_date ? dayjs(data.close_date as string | Date).format() : undefined,
        });
    }

    const loadAsync = async (inputValue: string): Promise<SelectOption[]> => {
        if (inputValue.length < 3) return [];

        const data: any = await queryClient.fetchQuery(useSearchByNameQueryOptions(`search_by/${moduleSingle}/${inputValue}`, inputValue, queryClient));

        const props = Array.isArray(data)
            ? data.map((prop: any) => ({
                label: prop.title,
                value: prop.id.toString(),
            }))
            : []

        setContacts(props);

        return props;
    };


    const testing = (value: any) => {

        if (Array.isArray(value) && value.length > 0 && value[0].label) {
            return value;
        } else {
            return [];
        }

    }

    const debouncedLoadProperties = debounce(
        (inputValue: string, callback: (options: SelectOption[]) => void) => {
            loadAsync(inputValue).then(callback);
        },
        1000
    );

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

        const related_services_index = newFields.findIndex(field => field.key == 'related_services')
        if (related_services_index != -1) {
            newFields[related_services_index].options = services?.map((service) => ({ label: (service as { title: string; id: number; }).title, value: (service as { title: string; id: number; }).id.toString() }))
        }

        setFields(newFields);
        return () => { }
    }, [agents, terms, services]);


    useEffect(() => {
        const fetchContacts = async () => {
            if (data.contact) {
                const dataContacts = await queryClient.fetchQuery(
                    useSearchByIdQueryOptions<Opportunity>(`search_by/${moduleSingle}/${data.contact}`, data.contact.toString(), queryClient)
                );

                const props = Array.isArray(dataContacts)
                    ? dataContacts.map((prop: Opportunity) => ({
                        label: prop.title,
                        value: prop.id.toString(),
                    }))
                    : []


                const finalData: SelectOption[] = [];

                data.contact?.map((item) => {
                    props.map(prop => {
                        if (item == prop.value) finalData.push({ value: item.toString(), label: prop.label });
                    })
                });

                if (initData) setData({ ...data, contact: finalData });

                setContacts(props);
            }
        };
        fetchContacts();
    }, []);

    return (
        <ModuleContentWrapper>
            <h1 className="mb-5">Opportunity Details</h1>

            <form className="grid grid-cols-2 gap-y-5 gap-x-24" >
                {fields.map(({ key, type, label, required, options, placeholder, isClearable, children, isAsyncSelect, isMultiSelect }) => (
                    <div className={`flex ${type == 'section' ? 'flex-col' : ''} justify-between ${type == 'textarea' || type == 'section' ? 'col-span-2' : ''}`} key={key}>
                        {type != 'section' && <label className="text-sm  w-1/2" htmlFor={key}> {label} {required && <sup className="text-red-500 text-base translate-y-1.5 ml-1 inline-block">*</sup>}</label>}
                        {
                            (type != 'select' && type != 'textarea' && type != 'checkbox' && type != 'datetimepicker' && type != 'section') && <Input
                                type={type}
                                name={key}
                                placeholder={label}
                                id={key}
                                value={data?.[key as keyof Opportunity] ?? ""}
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
                                value={data?.[key as keyof Opportunity] as dayjs.Dayjs}
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
                                isClearable
                                isMulti={isMultiSelect}
                                defaultOptions={contacts}
                                placeholder={placeholder ?? label}
                                loadOptions={debouncedLoadProperties}
                                value={isMultiSelect
                                    ? testing((data as any)[key])
                                    : options?.find(option => option.value == (data as any)[key])}
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
                                    value={options?.find(option => option.value == (data as any)[key])}
                                    options={options ?? []}
                                    onChange={(selectedOption) => {

                                        let newVal = { ...data };

                                        if (Array.isArray(selectedOption)) {
                                            (newVal as any)[key as keyof Opportunity] = selectedOption.map((item: SelectOption) => item.value);
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
                            type == 'textarea' && <TextArea key={key} name={key} id={key} value={data.description} className="w-[76%]" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const currentVal = e.target.value;
                                let newVal = { ...data };
                                (newVal as any)[key] = currentVal;
                                setData(newVal);
                            }}></TextArea>
                        }


                        {
                            type == 'section' && <>
                                <h2 className="font-medium mb-2" >{label}</h2>
                                <FormFields fields={children ?? []} data={data} setData={setData} />
                            </>
                        }


                    </div>
                ))}
            </form>

            <SaveBottomBar isLoading={status == 'pending'} onSubmit={handleSave} />
        </ModuleContentWrapper>
    )
}

export default OpportunityAdd;