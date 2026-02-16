import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Input, TextArea } from "../../components/InputForm";
import { ModuleContentWrapper } from "../../components/wrappers";
import { fullLeadFields } from "../../helpers/constants"
import { Country, State, City } from 'country-state-city';

import Select from 'react-select';
import AsyncSelect from 'react-select/async';

import debounce from 'lodash.debounce'

import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { selectsLeadQuery } from "../../loaders/leadLoader";
import type { AddSelectsResponse, Lead, SelectOption } from "../../helpers/types";
import { searchPropertyById, searchPropertyByName } from "../../hooks/searchPropertyByName";
import { SaveBottomBar } from "../../components/SaveBottomBar";
import { create_lead, edit_lead } from "../../api/leads";
import { useNavigate } from "react-router";
import { useSingleLeadSuspense } from "../../hooks/useSingleLead";
import { formatData } from "../../helpers/helpers";

const defaultLead = {} as Lead;
const isEditing = window.location.href.includes('edit');

const todosPaises = Country.getAllCountries();

export default function LeadAdd() {

    const queryClient = useQueryClient();
    const { data: lead } = useSuspenseQuery(useSingleLeadSuspense(true));
    const initLead = lead as Lead;
    const [fields, setFields] = useState(fullLeadFields);

    const navigate = useNavigate();

    const [leadData, setLeadData] = useState<Lead>(initLead ?? defaultLead);
    const textAreaRef = useRef<HTMLTemplateElement>(null);
    const { data: { data } } = useSuspenseQuery(selectsLeadQuery());

    const [properties, setProperties] = useState<SelectOption[]>([]);
    const selectData = data;
    const { status, mutate } = useMutation({
        mutationFn: isEditing ? edit_lead : create_lead,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['leads', 'list'] });
            navigate('/marketing');
        }
    });


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

    const debouncedLoadProperties = debounce(
        (inputValue: string, callback: (options: SelectOption[]) => void) => {
            loadProperties(inputValue).then(callback);
        },
        1000
    );

    const handleSave = () => {
        mutate(leadData);
    }

    // state hook
    useEffect(() => {

        const newFields = [...fields];
        const stateIndex = newFields.findIndex(field => field.key == 'state');
        const cityIndex = newFields.findIndex(field => field.key == 'city');

        if (!leadData.country) {
            newFields[stateIndex].options = [];
            newFields[cityIndex].options = [];
            setLeadData({ ...leadData, state: '', city: '' });
            setFields(newFields);
            return;
        };


        const countryCode = todosPaises.find(cty => cty.name == leadData.country)?.isoCode;

        const states = State.getStatesOfCountry(countryCode);
        newFields[stateIndex].options = states.map(state => ({ label: state.name, value: state.name }));

        setFields(newFields);

    }, [leadData.country]);

    // city hook
    useEffect(() => {

        const newFields = [...fields];
        const stateIndex = newFields.findIndex(field => field.key == 'state');
        const cityIndex = newFields.findIndex(field => field.key == 'city');

        if (!leadData.state || !leadData.country) {
            newFields[cityIndex].options = [];
            newFields[stateIndex].options = [];
            setLeadData({ ...leadData, city: '', state: '' });
            setFields(newFields);
            return;
        };

        const countryCode = todosPaises.find(cty => cty.name == leadData.country)?.isoCode;
        const states = State.getStatesOfCountry(countryCode);
        const stateCode = states.find(st => st.name == leadData.state)?.isoCode;


        const cities = City.getCitiesOfState(countryCode!, stateCode!);


        newFields[cityIndex].options = cities.map(city => ({ label: city.name, value: city.name }));

        setFields(newFields);

    }, [leadData.state]);

    useEffect(() => {
        let newFields = [...fields];

        const countryIndex = newFields.findIndex(field => field.key == 'country');
        newFields[countryIndex].options = todosPaises.map(country => ({ label: country.name, value: country.name }));

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

        setFields(newFields);
    }, []);

    return (
        <ModuleContentWrapper>
            <h1 className="mb-5">Lead Details</h1>
            <form className="grid grid-cols-2 gap-y-5 gap-x-24" >
                {fields.map(({ key, type, label, required, options, isSearchable, isClearable }) => (
                    <div className={`flex justify-between ${type == 'textarea' ? 'col-span-2' : ''}`} key={key}>
                        <label className="text-sm" htmlFor={key}> {label} {required && <sup className="text-red-500 text-base translate-y-1.5 ml-1 inline-block">*</sup>}</label>
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
                            type == 'select' && key == 'requested_property'
                                ? <AsyncSelect
                                    className="w-1/2"
                                    cacheOptions
                                    isClearable
                                    defaultOptions={properties}
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
                                : <></>
                        }

                        {
                            type == 'select' && (
                                key == 'country' ||
                                key == 'state' ||
                                key == 'city'
                            ) && (
                                <Select
                                    className="w-1/2"
                                    isClearable={isClearable}
                                    isSearchable={isSearchable}
                                    value={options?.find(opt => opt.value == leadData[key as keyof Lead])}
                                    options={options ?? []}
                                    onChange={(selectedOption) => {
                                        let newVal = { ...leadData };
                                        (newVal as any)[key] = (selectedOption as SelectOption)?.value;
                                        setLeadData(newVal);
                                    }}
                                />
                            )
                        }

                        {
                            type == 'select'
                            && key != 'country'
                            && key != 'city'
                            && key != 'state'
                            && key != 'requested_property'
                            && (
                                <Select
                                    className="w-1/2"
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



                    </div>
                ))}
            </form>

            <SaveBottomBar isLoading={status == 'pending'} onSubmit={handleSave} />
        </ModuleContentWrapper>
    )
}

