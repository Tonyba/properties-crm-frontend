
import ReactHtmlParser from 'react-html-parser';

import { FaRegCalendarAlt } from "react-icons/fa";
import { TbChecklist } from "react-icons/tb";
import { FaRegTrashAlt } from "react-icons/fa";
import { GoPencil } from "react-icons/go";

import type { Activities, BoxData } from '../../helpers/types'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { trashItem } from '../../helpers/helpers';
import { useModuleHeader } from '../../hooks/useModuleHeader';
import { useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';

const key = 'Activities';

export const SummaryActivities = ({ data }: BoxData<Activities>) => {

    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();
    const { leadId } = useParams();
    const queryClient = useQueryClient();

    const handleDelete = (id: number) => {

        withReactContent(Swal).fire({
            title: 'Are you sure that you want to delete?',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: async () => {
                try {
                    if (leadId) {
                        await trashItem(id, leadId);
                        await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/${key}/${leadId}`] });
                    }
                } catch (error) {
                    Swal.showValidationMessage(`
                        Request failed: ${error}
                    `);
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Deleted!', '', 'success');
            }
        });

    }

    const handleEdit = (id: number) => {
        console.log(id)
    }

    return (
        <>
            {data?.map(({ title, id, post_type, date, status }, i) => (
                <div key={i} className='flex text-left items-center py-2 not-last:border-b-1 border-gray-300'>
                    <div className="w-2/12 flex justify-center">
                        {post_type == 'task' ? <TbChecklist size={25} /> : <FaRegCalendarAlt size={25} />}
                    </div>
                    <div className='w-10/12' >
                        <div className="flex group items-center gap-1.5">
                            <p className='text-xs'>{ReactHtmlParser(title)}</p>
                            <div className="flex gap-1 text-xs hidden group-hover:flex">
                                <span onClick={() => handleDelete(id)} className='cursor-pointer'><FaRegTrashAlt /></span>
                                <span onClick={() => handleEdit(id)} className='cursor-pointer'><GoPencil /></span>
                            </div>
                        </div>
                        <p className='font-semibold'>{date}</p>
                    </div>
                    <div className="w-4/12 font-semibold">
                        {status}
                    </div>
                </div>
            ))}

        </>
    )
}
