import { use, useEffect, useState, type ChangeEvent } from "react";
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

const defaultData = {} as Opportunity;
const isEditing = window.location.href.includes('edit');

export const OpportunityAdd = () => {

    const queryClient = useQueryClient();
    const { data: dataItem } = useSuspenseQuery(useGetSingleSuspense(get_opportunity, true));
    const initData = dataItem as Opportunity;

    const [fields, setFields] = useState(fullOpportunityFields);
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    const { data: agents } = useAgents();
    const { data: terms } = useTaxonomies('opportunity');


    const [contacts, setContacts] = useState<SelectOption[]>([]);

    const { mutate, status } = useMutateSingle({
        createFn: create_opportunity,
        updateFn: edit_opportunity,
        isEditing
    });

    const [data, setData] = useState<Opportunity>(initData ?? defaultData);

    const handleSave = () => {
        mutate(data);
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

        setFields(newFields);
        return () => { }
    }, [agents, terms]);

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

                setContacts(props);
            }
        };
        fetchContacts();
    }, []);

    return (
        <ModuleContentWrapper>
            <h1 className="mb-5">Opportunity Details</h1>

            <form className="grid grid-cols-2 gap-y-5 gap-x-24" >
                {fields.map(({ key, type, label, required, options, placeholder, isClearable, children, isAsyncSelect }) => (
                    <div className={`flex ${type == 'section' ? 'flex-col' : ''} justify-between ${type == 'textarea' || type == 'section' ? 'col-span-2' : ''}`} key={key}>
                        {type != 'section' && <label className="text-sm" htmlFor={key}> {label} {required && <sup className="text-red-500 text-base translate-y-1.5 ml-1 inline-block">*</sup>}</label>}
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
                            type == 'datetimepicker' && <Input
                                name={key} id={key}
                                placeholder={placeholder ?? label}
                                aria-label={label}
                                className='w-1/2'
                                value={data?.[key as keyof Opportunity]}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const currentVal = e.target.value;

                                    let newVal = { ...data };
                                    (newVal as any)[key] = currentVal;
                                    setData(newVal);
                                }}
                                type="date" />

                        }

                        {
                            type == 'select' && isAsyncSelect && <AsyncSelect
                                className="w-1/2"
                                cacheOptions
                                isClearable
                                defaultOptions={contacts}
                                placeholder={placeholder ?? label}
                                loadOptions={debouncedLoadProperties}
                                value={data?.[key as keyof Opportunity]
                                    ? { label: contacts.find(prop => prop.value == data[key as keyof Opportunity])?.label, value: data[key as keyof Opportunity] } as SelectOption
                                    : null}
                                onChange={(selectedOption) => {
                                    let newVal = { ...data };
                                    (newVal as any)[key] = (selectedOption as SelectOption)?.value;
                                    setData(newVal);
                                }}
                            />
                        }

                        {
                            (type == 'select' && !isAsyncSelect) && (
                                <Select
                                    className="w-1/2"
                                    isClearable={isClearable}
                                    isSearchable={false}
                                    value={options?.find(opt => opt.value == data[key as keyof Opportunity])}
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