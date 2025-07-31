import { useRef } from "react";
import { Input, TextArea } from "../../components/InputForm";
import { ModuleContentWrapper } from "../../components/wrappers";
import { fullLeadFields } from "../../helpers/constants"

import Select from 'react-select';
import AsyncSelect from 'react-select/async';

import { useSuspenseQuery } from "@tanstack/react-query";
import { selectsLeadQuery } from "../../loaders/leadLoader";
import type { AddSelectsResponse, SelectOption } from "../../helpers/types";


export default function LeadAdd() {

    const textAreaRef = useRef<HTMLTemplateElement>(null);
    const { data: { data } } = useSuspenseQuery(selectsLeadQuery());

    const selectData = data;

    const formatData = (key: string, defaultOpts?: SelectOption[]): SelectOption[] => {

        const items = selectData[key as keyof AddSelectsResponse];

        if (items) {
            return items.map((item) => ({
                label: item.name,
                value: item.term_id.toString()
            }));
        }

        return defaultOpts || [];
    }

    const loadProperties = (inputValue: string) =>
        new Promise<SelectOption[]>((resolve) => {
            resolve([]);
        });

    return (
        <ModuleContentWrapper>
            <h1 className="mb-5">Lead Details</h1>

            <form className="grid grid-cols-2 gap-y-5 gap-x-24">

                {fullLeadFields.map(({ key, value, type, label, required, options }, i) => (
                    <div className={`flex justify-between ${type == 'textarea' ? 'col-span-2' : ''}`} key={key}>
                        <label className="text-sm" htmlFor={key}> {label} {required && <sup className="text-red-500 text-base translate-y-1.5 ml-1 inline-block">*</sup>}</label>
                        {
                            (type != 'select' && type != 'textarea') && <Input
                                type={type}
                                name={key}
                                placeholder={label}
                                id={key}
                                value={value}
                                className='w-1/2'
                            />
                        }

                        {
                            type == 'select' && (
                                key == 'requested_property' ?
                                    <AsyncSelect className="w-1/2" cacheOptions loadOptions={loadProperties} defaultOptions />
                                    : <Select
                                        className="w-1/2"
                                        isClearable={key == 'assigned_to' ? false : true}
                                        defaultValue={key == 'assigned_to' ? formatData(key, options)[0] : ''}
                                        options={formatData(key, options)}
                                        value={options?.find(option => option.value === value)}
                                        onChange={(selectedOption) => {

                                        }}
                                    />
                            )
                        }

                        {
                            type == 'textarea' && <TextArea ref={textAreaRef} className="w-[76%]" onClick={() => {
                                if (textAreaRef.current) textAreaRef.current.style.height = '275px'
                            }} ></TextArea>
                        }



                    </div>
                ))}

            </form>
        </ModuleContentWrapper>
    )
}

