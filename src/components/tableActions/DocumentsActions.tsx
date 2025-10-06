import { FiDownload } from 'react-icons/fi';
import type { Document } from '../../helpers/types';
import { CiImageOn } from 'react-icons/ci';
import { download_document } from '../../api/documents';


export const DocumentsActions = ({ external_url, file_id, filename, file }: Document) => {

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
        <div className='w-1/3 flex justify-center gap-2'>
            {external_url
                ? <a href={external_url} target='_blank'><CiImageOn /></a>
                : <a href="#" onClick={(e) => {
                    e.preventDefault();
                    handleDownload(file_id, filename!);
                }} ><FiDownload /></a>
            }
            {file && <a href={file} target='_blank'><CiImageOn /></a>}
        </div>
    )
}
