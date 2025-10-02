import { useState, type ChangeEvent } from "react";
import { FilterInput } from "../../components/FilterInputs";
import type { InputItem, SelectOption } from "../../helpers/types";

import Select from 'react-select';


type props = {
    filters: InputItem[];
    searchFn: (filters: InputItem[]) => void
}

function TableFilters({ filters, searchFn }: props) {

    const [newFilter, setNewFilter] = useState(filters);

    return (
        <div className="flex [&>*]:w-full  gap-2.5" onKeyDown={(e) => e.key === 'Enter' && searchFn(newFilter)}>
            <div>
                <button className="px-5 py-1.5 bg-blue-600 text-white rounded-xs text-xs font-medium" onClick={() => searchFn(newFilter)}>Search</button>
            </div>

            {newFilter.map(({ key, value, type, label, options, isMultiSelect }, i) => (
                <div key={key}>
                    {
                        type == 'datetimepicker' && <FilterInput
                            type="date"
                            name={key + '-filter'}
                            placeholder={label}
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
                        (type != 'select' && type != 'datetimepicker') && <FilterInput
                            type={type}
                            name={key + '-filter'}
                            placeholder={label}
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