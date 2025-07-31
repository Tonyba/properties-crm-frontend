import { useState, type ChangeEvent } from "react";
import { FilterInput } from "../../components/FilterInputs";
import type { InputItem } from "../../helpers/types";

import Select from 'react-select';
import AsyncSelect from 'react-select/async';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]

type props = {
    filters: InputItem[];
    searchFn: (filters: InputItem[]) => void
}

function TableFilters({ filters, searchFn }: props) {

    const [newFilter, setNewFilter] = useState(filters);

    return (
        <div className="flex [&>*]:w-full  gap-2.5">
            <div>
                <button className="px-5 py-1.5 bg-blue-600 text-white rounded-xs text-xs font-medium" onClick={() => searchFn(newFilter)}>Search</button>
            </div>

            {newFilter.map(({ key, value, type, label }, i) => (
                <div key={key}>
                    {
                        type != 'select' && <FilterInput
                            type={type}
                            name={key}
                            placeholder={label}
                            id={key}
                            value={value}
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
                                value={options.find(option => option.value === value)}
                                onChange={(selectedOption) => {
                                    let changed = [...newFilter];
                                    changed[i].value = selectedOption ? selectedOption.value : '';
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