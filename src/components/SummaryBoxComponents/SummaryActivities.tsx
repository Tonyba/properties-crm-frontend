
import ReactHtmlParser from 'react-html-parser';

import { FaRegCalendarAlt } from "react-icons/fa";
import { TbChecklist } from "react-icons/tb";


import type { Activities, BoxData } from '../../helpers/types'

export const SummaryActivities = ({ data }: BoxData<Activities>) => {
    return (
        <>
            {data?.map(({ title, id, post_type, date, status }, i) => (
                <div key={i} className='flex text-left items-center py-2 not-last:border-b-1 border-gray-300'>
                    <div className="w-2/12 flex justify-center">
                        {post_type == 'task' ? <TbChecklist size={25} /> : <FaRegCalendarAlt size={25} />}
                    </div>
                    <div className='w-10/12' >
                        <p className='text-xs'>{ReactHtmlParser(title)}</p>
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
