import { CiEdit } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaFileExport } from "react-icons/fa";

import { useState, type ChangeEvent } from "react";
import { SingleBoxContainer, SingleBoxTitle } from "../../components/SingleDetailBox"
import { leadFields } from "../../helpers/constants"
import { useParams } from "react-router";
import { Input } from "../../components/InputForm";
import { useQueryClient } from "@tanstack/react-query";
import type { Lead, SelectOption } from "../../helpers/types";

import Select from 'react-select';
import { formatSelectOpt } from "../../helpers/helpers";
import { useAgents } from "../../hooks/useAgents";

import { SummaryBox } from "../../components/SummaryBoxComponents/SummaryBox";
import { useLeadUpdate } from "../../hooks/useLeadUpdate";
import { useOffcanvas, useOffcanvasMutation } from "../../hooks/useOffcanvas";

const keyFields = leadFields.filter(item => item.required);

const LeadSummary = () => {

    const { id } = useParams();
    const queryClient = useQueryClient();

    const lead = queryClient.getQueryData<Lead>([`lead/${id}`]);
    const { data: agents } = useAgents(queryClient);

    const [leadData, setLeadData] = useState<Lead & { readonly: true }>(lead as Lead & { readonly: true });
    const [readOnlyFields, setReadOnlyFields] = useState(Object.keys(lead as Lead).map(key => ({ key, readonly: true, visible: false })));

    const { data: offcanvasOpts } = useOffcanvas({ queryClient });
    const { mutate: mutateOffcanvas } = useOffcanvasMutation({ queryClient });


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
        setLeadData({ ...leadData, [key]: lead ? lead[key as keyof Lead] : '' });
    }

    const saveChange = async () => {
        mutate(leadData);
        setReadOnlyFields(readOnlyFields.map(val => ({ ...val, readonly: true, visible: false })));
    }

    const { mutate } = useLeadUpdate(id ?? '', lead as Lead, queryClient);

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

    return (
        <div className='flex gap-5'>
            <div className="w-1/3 space-y-5">
                <SingleBoxContainer>
                    <SingleBoxTitle>Key Fields</SingleBoxTitle>
                    <div className="space-y-2">
                        {keyFields.map(({ key, type, label, required }) => (
                            <div className={`flex justify-between relative group ${type == 'textarea' ? 'col-span-2' : ''}`} key={key}>
                                <label className="text-sm" htmlFor={key}>{label}</label>

                                {
                                    (type != 'select' && type != 'textarea' && required) && <Input
                                        type={type}
                                        name={key}
                                        placeholder={label}
                                        id={key}
                                        value={leadData?.[key as keyof Lead] ?? ""}
                                        readOnly={readOnlyFields.length ? readOnlyFields.find(field => field.key == key)?.readonly : true}
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
                                    type == 'select' && <Select
                                        className="w-1/2"
                                        options={agents ? agents.map(agent => formatSelectOpt(agent.name, agent.id.toString())) : []}
                                        value={leadData?.[key as keyof Lead] ? { value: leadData.assigned_to, label: agents?.find(agent => agent.id.toString() == leadData.assigned_to)?.name } : null}
                                        isDisabled={readOnlyFields.length ? readOnlyFields.find(field => field.key == key)?.readonly : true}
                                        onChange={(selectedOption) => {
                                            let newVal = { ...leadData };
                                            (newVal as any)[key] = (selectedOption as SelectOption)?.value;
                                            setLeadData(newVal);
                                        }}
                                    />
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
            <div className="w-2/3 space-y-5">
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
                <SummaryBox
                    title="Comments"
                    noFoundMessage="No Comments"
                />
            </div>
        </div>
    )
}

export default LeadSummary