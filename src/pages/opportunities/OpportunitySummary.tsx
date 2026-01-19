import { create_opportunity, edit_opportunity } from "@/api/opportunities";
import { Input } from "@/components/InputForm";
import { SingleBoxContainer, SingleBoxTitle } from "@/components/SingleDetailBox";
import { opportunityFields } from "@/helpers/constants";
import type { Opportunity, SelectOption } from "@/helpers/types";
import { useAgents } from "@/hooks/useAgents";
import { useModuleHeader } from "@/hooks/useModuleHeader";
import { useMutateSingle } from "@/hooks/useMutateSingle";
import { useOffcanvas, useOffcanvasMutation } from "@/hooks/useOffcanvas";
import { useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { useState, type ChangeEvent } from "react";
import { CiEdit } from "react-icons/ci";
import { FaCheck, FaExternalLinkAlt, FaFileExport, FaTimes } from "react-icons/fa";
import { useParams } from "react-router";
import debounce from 'lodash.debounce'
import { useSearchByNameQueryOptions } from "@/hooks/useSearchByName";
import { formatSelectOpt } from "@/helpers/helpers";

import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { SummaryBox } from "@/components/SummaryBoxComponents/SummaryBox";

const keyFields = opportunityFields.filter(field => ['title', 'close_date', 'assigned_to',].includes(field.key));

const OpportunitySummary = () => {

    const { id } = useParams();
    const queryClient = useQueryClient();
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    const initData = queryClient.getQueryData<Opportunity>([`${moduleSingle}/${id}`]);
    const { data: agents } = useAgents();
    const [contacts, setContacts] = useState<SelectOption[]>([]);


    const [data, setData] = useState<Opportunity & { readonly: true }>(initData as Opportunity & { readonly: true });
    const [readOnlyFields, setReadOnlyFields] = useState(Object.keys(initData as Opportunity).map(key => ({ key, readonly: true, visible: false })));

    const { data: offcanvasOpts } = useOffcanvas({ queryClient });
    const { mutate: mutateOffcanvas } = useOffcanvasMutation({ queryClient });

    const { mutate } = useMutateSingle({
        createFn: create_opportunity,
        updateFn: edit_opportunity,
        isEditing: true
    });

    const handleEditBtn = (key: string) => {
        const selected = readOnlyFields.findIndex(field => field.key == key);
        let newVal = [...readOnlyFields];
        newVal = newVal.map(val => ({ ...val, readonly: true, visible: false }));
        newVal[selected].visible = true;
        newVal[selected].readonly = false;
        setReadOnlyFields(newVal);
    }

    const handleCancel = (key: string) => {
        let newVal = [...readOnlyFields];
        newVal = newVal.map(val => ({ ...val, readonly: true, visible: false }));
        setReadOnlyFields(newVal);
        setData({ ...data, [key]: data ? data[key as keyof Opportunity] : '' });
    }

    const saveChange = async () => {
        mutate(data);
        setReadOnlyFields(readOnlyFields.map(val => ({ ...val, readonly: true, visible: false })));
    }

    const docsOpts = [
        {
            label: 'From File Url',
            icon: <FaExternalLinkAlt />,
            optFn: () => {
                mutateOffcanvas({
                    queryClient,
                    offCanvasOpts: {
                        ...offcanvasOpts,
                        title: 'New Document',
                        template: 'document',
                        size: 'xl',
                        customOpts: {
                            ...offcanvasOpts?.customOpts,
                            external: true
                        }
                    }
                });
            },
        },
        {
            label: 'File Upload',
            icon: <FaFileExport />,
            optFn: () => {
                mutateOffcanvas({
                    queryClient,
                    offCanvasOpts: {
                        ...offcanvasOpts,
                        title: 'Upload Document',
                        template: 'document',
                        size: 'xl',
                        customOpts: {
                            ...offcanvasOpts?.customOpts,
                            external: false
                        }
                    }
                });
            }
        }
    ];

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

    return (
        <div className="grid  grid-cols-3 gap-5">
            <div className="space-y-5">
                <SingleBoxContainer>
                    <SingleBoxTitle>Key Fields</SingleBoxTitle>
                    <div className="space-y-2">
                        {keyFields.map(({ key, type, label, required, isMultiSelect, isAsyncSelect, placeholder, options }) => (
                            <div className={`flex justify-between relative group ${type == 'textarea' ? 'col-span-2' : ''}`} key={key}>
                                <label className="text-sm" htmlFor={key}>{label}</label>

                                {
                                    type == 'datetimepicker'
                                    &&
                                    <DatePicker className='w-1/2'
                                        format="DD/MM/YYYY"
                                        disabled={readOnlyFields.length ? readOnlyFields.find(field => field.key == key)?.readonly : true}
                                        value={typeof data?.[key as keyof Opportunity] == 'string' ? dayjs(data?.[key as keyof Opportunity] as string) : data?.[key as keyof Opportunity] as dayjs.Dayjs}
                                        onChange={(newValue) => {
                                            let newVal = { ...data };
                                            (newVal as any)[key] = newValue;
                                            setData(newVal);
                                        }}
                                        name={key} key={key} label={label} />
                                }

                                {
                                    (type != 'select' && type != 'textarea' && type != 'datetimepicker') && <Input
                                        type={type}
                                        name={key}
                                        placeholder={label}
                                        id={key}
                                        required={required}
                                        value={data?.[key as keyof Opportunity] ?? ""}
                                        readOnly={readOnlyFields.length ? readOnlyFields.find(field => field.key == key)?.readonly : true}
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
                                    type == 'select' && isAsyncSelect && <AsyncSelect
                                        className="w-1/2"
                                        cacheOptions
                                        isClearable
                                        isMulti={isMultiSelect}
                                        isDisabled={readOnlyFields.length ? readOnlyFields.find(field => field.key == key)?.readonly : true}
                                        defaultOptions={contacts}
                                        placeholder={placeholder ?? label}
                                        loadOptions={debouncedLoadProperties}
                                        value={options?.find(option => option.value === (data as any)[key])}
                                        onChange={(selectedOption) => {
                                            let newVal = { ...data };
                                            if (Array.isArray(selectedOption)) {
                                                (newVal as any)[key] = selectedOption.map((item: SelectOption) => item.value);
                                            } else if (!Array.isArray(selectedOption) && selectedOption) {
                                                const selected = selectedOption as SelectOption;
                                                (newVal as any)[key] = selected.value;
                                            }
                                            setData(newVal);
                                        }}
                                    />
                                }

                                {
                                    type == 'select' && <Select

                                        className="w-1/2"
                                        options={agents ? agents.map(agent => formatSelectOpt(agent.name, agent.id.toString())) : []}
                                        value={data?.[key as keyof Opportunity] ? { value: data.assigned_to, label: agents?.find(agent => agent.id.toString() == data.assigned_to)?.name } : null}
                                        isDisabled={readOnlyFields.length ? readOnlyFields.find(field => field.key == key)?.readonly : true}
                                        onChange={(selectedOption) => {
                                            let newVal = { ...data };
                                            (newVal as any)[key] = (selectedOption as SelectOption)?.value;
                                            setData(newVal);
                                        }}
                                    />
                                }

                                {


                                }

                                {
                                    (!readOnlyFields.find(field => field.key == key)?.visible &&
                                        !readOnlyFields.some(field => field.visible == true)) &&
                                    <button onClick={() => handleEditBtn(key)} className="invisible group-hover:visible  cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 bg-white p-1"><CiEdit /></button>
                                }

                                {
                                    readOnlyFields.find(field => field.key == key)?.visible && <div className="flex gap-1 absolute right-3 top-1/2 -translate-y-1/2 text-white text-xs">
                                        <button onClick={() => saveChange()} className="cursor-pointer text-green-600 p-1 bg-white"> <FaCheck /> </button>
                                        <button onClick={() => handleCancel(key)} className="cursor-pointer text-red-600 p-1 bg-white"> <FaTimes /> </button>
                                    </div>
                                }


                            </div>
                        ))}
                    </div>
                </SingleBoxContainer>

                <SummaryBox title="Documents" actions={[
                    {
                        action: 'Documents',
                        isWithSelect: true,
                        options: docsOpts
                    }
                ]} />
            </div>
            <div className="space-y-5">
                <SummaryBox title="Related Services" noFoundMessage="No Related Services" />
            </div>

            <div className="space-y-5">
                <SummaryBox title="Activities" noFoundMessage="No Pending Activities" actions={[
                    {
                        action: 'Task',
                        action_fn: () => {
                            mutateOffcanvas({
                                queryClient,
                                offCanvasOpts: { ...offcanvasOpts, title: 'Quick Create Task', template: 'task', size: 'xl' }
                            });
                        }
                    },
                    {
                        action: 'Event',
                        action_fn: () => {
                            mutateOffcanvas({
                                queryClient,
                                offCanvasOpts: { ...offcanvasOpts, title: 'Quick Create Event', template: 'event', size: 'xl' }
                            });
                        }
                    }
                ]} />
            </div>
        </div>
    )
}

export default OpportunitySummary