
import ReactHtmlParser from 'react-html-parser';

import { FaCheck, FaRegCalendarAlt, FaTimes } from "react-icons/fa";
import { TbChecklist } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";
import { GoPencil } from "react-icons/go";

import type { Activities, BoxData, Event } from '../../helpers/types'

import { useEffect, useState } from 'react';
import { useHandleItemDeletion } from '../../hooks/useHandleItemDeletion';
import { CiEdit } from 'react-icons/ci';
import { useTaxonomies } from '../../hooks/useTaxonomies';
import { useEventMutation } from '../../hooks/useEventMutation';


const key = 'Activities';
type ReadOnlyFieldWithActivities = {
    readOnlyFields?: {
        key: string,
        readonly: boolean,
        visible: boolean
    }
} & Activities;

export const SummaryActivities = ({ data }: BoxData<ReadOnlyFieldWithActivities>) => {

    const { deleteFn } = useHandleItemDeletion(key);
    const { mutate } = useEventMutation('edit');
    const { data: taxEvents, isPending: pendingEvents } = useTaxonomies('event');

    const [summaryData, setSummaryData] = useState(data?.map(item => (
        { ...item, readOnlyFields: { readonly: true, visible: false, key: 'event_status', id: item.id } })) ?? []);

    const handleEditBtn = (key: string, id: number) => {
        const selected = summaryData?.findIndex(field => field.readOnlyFields.key == key && field.readOnlyFields.id == id) ?? -1;

        if (selected > -1) {
            let newVal = [...summaryData];
            newVal = newVal.map(val => ({ ...val, readOnlyFields: { ...val.readOnlyFields, readonly: true, visible: false } }));
            newVal[selected].readOnlyFields.visible = true;
            newVal[selected].readOnlyFields.readonly = false;
            setSummaryData(newVal);
        }

    }

    const handleCancel = () => {
        let newVal = [...summaryData];
        newVal = newVal.map(val => ({
            ...val,
            readOnlyFields: {
                ...val.readOnlyFields,
                readonly: true, visible: false
            }
        }));
        setSummaryData(newVal);
    }

    const handleDelete = (deleteId: number) => {
        deleteFn(deleteId);
    }

    const handleEdit = (id: number) => {
        console.log(id)
    }

    const saveChange = async (id: number) => {
        const newChange = [...summaryData ?? []];
        const selectedChanged = newChange.find(dat => dat.id == id);
        const newActivity = { ...selectedChanged };
        delete newActivity.readOnlyFields;

        if (selectedChanged && taxEvents) {

            const statusId = taxEvents['event_status'].find(val => val.label == selectedChanged.status)?.value
            const eventObject = { ...newActivity, event_status: statusId } as Event;
            mutate(eventObject);

            setSummaryData(
                summaryData.map(dat => ({
                    ...dat,
                    readOnlyFields: {
                        ...dat.readOnlyFields,
                        readonly: true,
                        visible: false
                    }
                })));
        }

    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>, id: number) => {
        if (taxEvents) {
            const acts = [...summaryData];
            const selectedActivity = acts.findIndex(act => act.id == id);

            const val = e.target.value;
            const selectedTax = taxEvents['event_status'].find(type => type.value == val);

            acts[selectedActivity].status = selectedTax?.label ?? 'status';

            setSummaryData(acts);
        }
    }

    useEffect(() => {



        return () => { }
    }, [])

    return (
        <>
            {(pendingEvents) && 'loading...'}
            {summaryData.map(({ title, id, post_type, date, status, readOnlyFields }, i) => (
                <div key={i} className='flex text-left items-center py-2 not-last:border-b-1 border-gray-300'>
                    <div className="w-2/12 flex justify-center">
                        {post_type == 'task' ? <TbChecklist size={25} /> : <FaRegCalendarAlt size={25} />}
                    </div>
                    <div className='w-10/12' >
                        <div className="flex group items-center gap-1.5">
                            <p className='text-xs'>{ReactHtmlParser(title)}</p>
                            <div className="gap-1 text-xs hidden group-hover:flex">
                                <span onClick={() => handleDelete(id)} className='cursor-pointer'><FaRegTrashAlt /></span>
                                <span onClick={() => handleEdit(id)} className='cursor-pointer'><GoPencil /></span>
                            </div>
                        </div>
                        <p className='font-semibold'>{date}</p>
                    </div>
                    <div className="w-4/12 font-semibold ">

                        <div className='relative group inline-block'>
                            {
                                (!readOnlyFields.visible && !summaryData.some(dat => dat.readOnlyFields.visible)) &&
                                <button onClick={() => handleEditBtn(readOnlyFields.key, id)} className="invisible group-hover:visible  cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 bg-white p-1"><CiEdit /></button>
                            }
                            {
                                readOnlyFields.visible && <div className="flex gap-1 absolute -right-12 top-1/2 -translate-y-1/2 text-white text-xs">
                                    <button onClick={() => saveChange(id)} className="cursor-pointer text-green-600 p-1 bg-white"> <FaCheck /> </button>
                                    <button onClick={() => handleCancel()} className="cursor-pointer text-red-600 p-1 bg-white"> <FaTimes /> </button>
                                </div>
                            }

                            {readOnlyFields.readonly && status}

                            {
                                (!readOnlyFields.readonly && taxEvents) && <select
                                    value={taxEvents[readOnlyFields.key].find(val => val.label == status)?.value}
                                    onChange={(e) => handleChange(e, id)}>
                                    {taxEvents[readOnlyFields.key].map((val, j) => (<option key={`${id}-${j}`} value={val.value}>{val.label}</option>))}
                                </select>
                            }
                        </div>
                    </div>
                </div>
            ))}

        </>
    )
}
