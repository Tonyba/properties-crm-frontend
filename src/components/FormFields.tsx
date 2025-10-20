import type { ChangeEvent } from "react";
import type { InputItem, SelectOption } from "../helpers/types";
import { Input, TextArea } from "./InputForm";
import Select from 'react-select';

type FormFieldsProps = {
    fields: InputItem[];
    setData: (data: any) => void;
    data: any
};

export const FormFields = ({ fields, setData, data }: FormFieldsProps) => {
    return (

        <div className="grid grid-cols-2 gap-y-5 gap-x-24">
            {fields.map(({ key, type, label, required, options, placeholder, isClearable }) => (

                <div className={`flex justify-between ${type == 'textarea' ? 'col-span-2' : ''}`} key={key}>
                    <label className="text-sm" htmlFor={key}> {label} {required && <sup className="text-red-500 text-base translate-y-1.5 ml-1 inline-block">*</sup>}</label>
                    {
                        (type != 'select' && type != 'textarea' && type != 'checkbox' && type != 'datetimepicker' && type != 'section') && <Input
                            type={type}
                            name={key}
                            placeholder={label}
                            id={key}
                            value={data?.[key] ?? ""}
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
                            value={data?.[key]}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const currentVal = e.target.value;

                                let newVal = { ...data };
                                (newVal as any)[key] = currentVal;
                                setData(newVal);
                            }}
                            type="date" />

                    }
                    {
                        type == 'select' && (
                            <Select
                                className="w-1/2"
                                isClearable={isClearable}
                                isSearchable={false}
                                value={options?.find(opt => opt.value == data[key])}
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
        </div>

    )
}
