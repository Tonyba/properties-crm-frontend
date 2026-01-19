import { useState, type ChangeEvent } from "react";
import { FilterInput } from "../../components/FilterInputs";
import type { InputItem, SelectOption } from "../../helpers/types";

import Select from 'react-select';
import { DateRangePicker } from "../../components/application/date-picker/date-range-picker";
import type { DateValue, RangeValue } from "react-aria";
import { DatePicker } from "../../components/application/date-picker/date-picker";


type props = {
    filters: InputItem[];
    searchFn: (filters: InputItem[]) => void
}

function TableFilters({ filters, searchFn }: props) {

    const [newFilter, setNewFilter] = useState(filters);

    return (
        <div className="flex [&>*]:w-full  gap-2.5 max-w-10/12" onKeyDown={(e) => e.key === 'Enter' && searchFn(newFilter)}>
            <div>
                <button className="px-5 py-1.5 bg-blue-600 text-white rounded-xs text-xs font-medium cursor-pointer" onClick={() => searchFn(newFilter)}>Search</button>
            </div>

            {newFilter.map(({ key, value, type, label, options, isMultiSelect, placeholder, isSingleDate }, i) => (
                <div key={key}>
                    {
                        type == 'datetimepicker'
                        && (isSingleDate
                            ? <DatePicker
                                value={newFilter[i].value as DateValue}
                                className='w-1/2' id={key} aria-label={label}
                                onChange={(date) => {
                                    let changed = [...newFilter];
                                    changed[i].value = date as DateValue;
                                    setNewFilter(changed);
                                }}
                            />
                            : <DateRangePicker
                                className='w-1/2' id={key} aria-label="Date picker"
                                value={newFilter[i].value as RangeValue<DateValue>}
                                onChange={(date) => {
                                    let changed = [...newFilter];
                                    changed[i].value = date as RangeValue<DateValue>;
                                    setNewFilter(changed);
                                }} />)
                    }

                    {
                        (type != 'select' && type != 'datetimepicker') && <FilterInput
                            type={type}
                            name={key + '-filter'}
                            placeholder={placeholder ? placeholder : label}
                            id={key + '-filter'}
                            value={newFilter[i].value}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                let changed = [...newFilter];
                                changed[i].value = e.target.value;
                                setNewFilter(changed);
                            }}
                        />
                    }

                    {
                        type == 'select' && (
                            <Select
                                className="w-full"
                                options={options}
                                isMulti={isMultiSelect}
                                placeholder={label ?? 'Select...'}
                                value={options?.find(option => option.value === value)}
                                onChange={(selectedOption) => {

                                    let changed = [...newFilter];
                                    if (Array.isArray(selectedOption)) {
                                        changed[i].value = selectedOption.map((item: SelectOption) => item.value);
                                    } else if (!Array.isArray(selectedOption) && selectedOption) {
                                        const selected = selectedOption as SelectOption;
                                        changed[i].value = selected.value;
                                    }

                                    setNewFilter(changed);
                                }}
                            />
                        )
                    }

                </div>
            ))}

        </div>
    );
}

export default TableFilters