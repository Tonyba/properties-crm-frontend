import { GoPencil } from "react-icons/go";
import { FaRegTrashAlt } from "react-icons/fa";

import type { Activities } from "../../helpers/types"
import { useHandleItemDeletion } from "../../hooks/useHandleItemDeletion";

type ActivitiesProps = {
    item: Activities
}

const key = 'Activities';

export const ActivitiesAction = ({ item }: ActivitiesProps) => {

    const { deleteFn } = useHandleItemDeletion(key);

    const handleDelete = () => {
        deleteFn(item.id);
    }

    const handleEdit = () => {

    }

    return <div className="flex gap-1">
        <button className="cursor-pointer" onClick={handleEdit}><GoPencil /></button>
        <button className="cursor-pointer" onClick={handleDelete} ><FaRegTrashAlt /></button>
    </div>
}