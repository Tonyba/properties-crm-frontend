import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SaveBottomBar } from "../SaveBottomBar";
import { useParams } from "react-router";
import { useEffect, useState, type ChangeEvent } from "react";
import { useAgents } from "../../hooks/useAgents";
import moment from "moment";
import type { SelectOption, Event } from "../../helpers/types";
import { useTaxonomies } from "../../hooks/useTaxonomies";
import { useOffcanvas, useOffcanvasMutation } from "../../hooks/useOffcanvas";
import { useEventMutation } from "../../hooks/useEventMutation";
import { DateFormat, EventFormFields } from "../../helpers/constants";
import { QuickForm } from "../QuickForm";
import { Input, TextArea } from "../InputForm";
import Select from 'react-select';
import { useGetSingle } from "../../hooks/useGetSingle";
import { useModuleHeader } from "../../hooks/useModuleHeader";

const quickFields = EventFormFields.filter(field => field.quickField);
const defaultGetSingleFn = (id: string, update?: boolean) => new Promise(() => { });

export const QuickEvent = () => {

    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    const queryClient = useQueryClient();
    const { id } = useParams();
    const [getSingleFn, setSingleFn] = useState<(id: string, updating?: boolean | undefined) => Promise<any>>(defaultGetSingleFn);

    const [fields, setFields] = useState(quickFields);

    const { data: agents } = useAgents();


    const [event, setEvent] = useState<Event>({
        from: moment().format(),
        to: moment().format(),
        relation: parseInt(id!)
    } as Event);

    const { data } = useGetSingle({});

    const { data: taxonomies } = useTaxonomies('event');

    const { data: offcanvasOpts } = useOffcanvas({ queryClient });
    const { mutate: mutateOffcanvas } = useOffcanvasMutation({ queryClient });

    const { mutate, status } = useEventMutation('create');

    const handleCancel = () => {
        mutateOffcanvas({ queryClient, offCanvasOpts: { ...offcanvasOpts, open: false } })
    }


    const handleSave = () => {
        const dataToSave = { ...event };
        dataToSave.from = moment(event.from).format(DateFormat);
        dataToSave.to = moment(event.to).format(DateFormat);
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
        setEvent({ ...event, assigned_to: data.assigned_to });

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
                                value={event?.[key as keyof Event]}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const currentVal = e.target.value;

                                    let newVal = { ...event };
                                    (newVal as any)[key] = currentVal;
                                    setEvent(newVal);
                                }}
                                type="datetime-local" />

                        }
                        {
                            (type != 'select' && type != 'textarea' && type != 'datetimepicker') && <Input
                                type={type}
                                name={key}
                                placeholder={label}
                                id={key}
                                value={event?.[key as keyof Event] ?? ""}
                                className={key == 'title' ? 'w-[77%]' : 'w-1/2'}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const currentVal = e.target.value;
                                    let newVal = { ...event };
                                    (newVal as any)[key] = currentVal;
                                    setEvent(newVal);
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
                                    value={options?.find(opt => opt.value == event[key as keyof Event])}
                                    onChange={(selectedOption) => {
                                        let newVal = { ...event };
                                        (newVal as any)[key] = (selectedOption as SelectOption)?.value;
                                        setEvent(newVal);
                                    }}
                                />
                            )
                        }

                        {
                            type == 'textarea' && <TextArea key={key} name={key} id={key} value={document[key as keyof Document]} className="w-[77%]" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const currentVal = e.target.value;
                                let newVal = { ...event };
                                (newVal as any)[key] = currentVal;
                                setEvent(newVal);
                            }}></TextArea>
                        }

                    </div>
                ))}
            </QuickForm>
            <SaveBottomBar isLoading={status == 'pending'} saveString="Create" onSubmit={handleSave} onCancel={handleCancel} isFullWidth={true} />
        </>

    )
}
