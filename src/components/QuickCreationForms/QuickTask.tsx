import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ChangeEvent } from "react";
import { useParams } from "react-router"


import Select from 'react-select';
import moment from 'moment';

import { DateFormat, TaskFormFields } from "../../helpers/constants";
import { useOffcanvas, useOffcanvasMutation } from "../../hooks/useOffcanvas";
import { SaveBottomBar } from "../SaveBottomBar";


import type { Lead, SelectOption, Task } from "../../helpers/types";
import { QuickForm } from "../QuickForm";
import { useSingleLead } from "../../hooks/useSingleLead";
import { Input, TextArea } from "../InputForm";
import { useAgents } from "../../hooks/useAgents";
import { useTaxonomies } from "../../hooks/useTaxonomies";
import { useTaskMutation } from "../../hooks/useTaskMutation";


const quickFields = TaskFormFields.filter(field => field.quickField);

export const QuickTask = () => {

    const queryClient = useQueryClient();
    const { id } = useParams();

    const [fields, setFields] = useState(quickFields);

    const { data: agents } = useAgents(queryClient);


    const [task, setTask] = useState<Task>({
        from: moment().format(),
        to: moment().format(),
        relation: parseInt(id!)
    } as Task);

    const { data } = useSingleLead();
    const lead = data as Lead;

    const { data: taxonomies } = useTaxonomies('task');

    const { data: offcanvasOpts } = useOffcanvas({ queryClient });
    const { mutate: mutateOffcanvas } = useOffcanvasMutation({ queryClient });

    const { mutate, status } = useTaskMutation();

    const handleCancel = () => {
        mutateOffcanvas({ queryClient, offCanvasOpts: { ...offcanvasOpts, open: false } })
    }


    const handleSave = () => {
        const dataToSave = { ...task };
        dataToSave.from = moment(task.from).format(DateFormat);
        dataToSave.to = moment(task.to).format(DateFormat);
        mutate(dataToSave);
    }

    useEffect(() => {
        let newFields = [...fields];
        const assigned_index = newFields.findIndex(field => field.key == 'assigned_to');

        if (assigned_index != -1) {
            newFields[assigned_index].options = agents?.map((agent) => ({ label: agent.name, value: agent.id.toString() }));
        }


        if (taxonomies) {
            const taxs = Object.keys(taxonomies);
            console.log(newFields)
            taxs.map(tax => {
                const foundIndex = newFields.findIndex(field => field.key == tax);
                if (newFields[foundIndex]) newFields[foundIndex].options = taxonomies[tax];
            })
        }

        setFields(newFields);
        setTask({ ...task, assigned_to: lead.assigned_to });

        return () => { }
    }, [taxonomies]);

    return (
        <>
            <QuickForm >
                {fields.map(({ key, type, label, required, options, placeholder, isClearable }) => (
                    <div className={`flex justify-between ${(type == 'textarea' || type == 'upload' || key == 'title') ? 'col-span-2' : ''}`} key={key}>
                        <label className="text-sm" htmlFor={key}> {label} {required && <sup className="text-red-500 text-base translate-y-1.5 ml-1 inline-block">*</sup>}</label>
                        {
                            type == 'datetimepicker' && <Input
                                name={key} id={key}
                                placeholder={placeholder ?? label}
                                aria-label={label}
                                className='w-1/2'
                                value={task?.[key as keyof Task]}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const currentVal = e.target.value;

                                    let newVal = { ...task };
                                    (newVal as any)[key] = currentVal;
                                    setTask(newVal);
                                }}
                                type="datetime-local" />

                        }
                        {
                            (type != 'select' && type != 'textarea' && type != 'datetimepicker') && <Input
                                type={type}
                                name={key}
                                placeholder={label}
                                id={key}
                                value={task?.[key as keyof Task] ?? ""}
                                className={key == 'title' ? 'w-[77%]' : 'w-1/2'}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const currentVal = e.target.value;
                                    let newVal = { ...task };
                                    (newVal as any)[key] = currentVal;
                                    setTask(newVal);
                                }}
                            />
                        }
                        {
                            type == 'select' && (
                                <Select
                                    className="w-1/2"
                                    isClearable={isClearable}
                                    isSearchable={false}
                                    options={options ?? []}
                                    placeholder={placeholder ?? 'Select...'}
                                    value={options?.find(opt => opt.value == task[key as keyof Task])}
                                    onChange={(selectedOption) => {
                                        let newVal = { ...task };
                                        (newVal as any)[key] = (selectedOption as SelectOption)?.value;
                                        setTask(newVal);
                                    }}
                                />
                            )
                        }

                        {
                            type == 'textarea' && <TextArea key={key} name={key} id={key} value={document[key as keyof Document]} className="w-[77%]" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const currentVal = e.target.value;
                                let newVal = { ...task };
                                (newVal as any)[key] = currentVal;
                                setTask(newVal);
                            }}></TextArea>
                        }

                    </div>
                ))}
            </QuickForm>
            <SaveBottomBar isLoading={status == 'pending'} saveString="Create" onSubmit={handleSave} onCancel={handleCancel} isFullWidth={true} />
        </>

    )
}
