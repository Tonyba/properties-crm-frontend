import type { BoxData, Document } from '../../helpers/types'
import ReactHtmlParser from 'react-html-parser';
import { DocumentsActions } from '../tableActions/DocumentsActions';



export const SummaryDocuments = ({ data }: BoxData<Document>) => {

    return (
        <>
            <div className='flex font-semibold text-left mb-1'>
                <div className="w-1/3">
                    Title
                </div>
                <div className="w-1/3">
                    File Name
                </div>
            </div>
            {data?.map(({ title, filename }, i) => (
                <div key={i} className='flex text-left items-center py-2 not-last:border-b-1 border-gray-300'>
                    <div className='w-1/3' >
                        {ReactHtmlParser(title)}
                    </div>
                    <div className='w-1/3' >
                        {filename}
                    </div>
                    <DocumentsActions {...data[i]} />
                </div>
            ))}
        </>
    )
}
