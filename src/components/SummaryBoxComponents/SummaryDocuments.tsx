import type { BoxData, Document } from '../../helpers/types'
import ReactHtmlParser from 'react-html-parser';
import { CiImageOn } from "react-icons/ci";
import { FiDownload } from "react-icons/fi";
import { download_document } from '../../api/documents';



export const SummaryDocuments = ({ data }: BoxData<Document>) => {



    const handleDownload = async (id: number, fileName: string) => {
        const response = await download_document(id.toString());
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }

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
            {data?.map(({ title, filename, file, file_id, external_url }, i) => (
                <div key={i} className='flex text-left items-center py-2 not-last:border-b-1 border-gray-300'>
                    <div className='w-1/3' >
                        {ReactHtmlParser(title)}
                    </div>
                    <div className='w-1/3' >
                        {filename}
                    </div>
                    <div className='w-1/3 flex justify-center gap-2'>
                        {external_url
                            ? <a href={external_url} target='_blank'></a>
                            : <a href="#" onClick={(e) => {
                                e.preventDefault();
                                handleDownload(file_id, filename!);
                            }} ><FiDownload /></a>
                        }
                        <a href={file} target='_blank'><CiImageOn /></a>
                    </div>
                </div>
            ))}
        </>
    )
}
