import { FiDownload } from 'react-icons/fi';
import type { Document } from '../../helpers/types';
import { CiImageOn } from 'react-icons/ci';
import { download_document } from '../../api/documents';
import { FaRegTrashAlt } from "react-icons/fa";
import { useHandleItemDeletion } from '../../hooks/useHandleItemDeletion';

type DocumentActionsProps = {
    delete?: boolean
} & Document;

const key = 'Lead';

export const DocumentsActions = (opts: DocumentActionsProps) => {

    const { deleteFn } = useHandleItemDeletion(key);

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
            {opts.external_url
                ? <a href={opts.external_url} target='_blank'><CiImageOn /></a>
                : <a href="#" onClick={(e) => {
                    e.preventDefault();
                    handleDownload(opts.file_id, opts.filename!);
                }} ><FiDownload /></a>
            }
            {opts.file && <a href={opts.file} target='_blank'><CiImageOn /></a>}
            {opts.delete && <button onClick={() => deleteFn(opts.id)} className='cursor-pointer' ><FaRegTrashAlt /></button>}
        </div>
    )
}
