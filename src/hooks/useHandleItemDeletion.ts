import { useQueryClient } from "@tanstack/react-query";
import { useModuleHeader } from "./useModuleHeader";
import { handleItemDeletion } from "../helpers/helpers";
import { useParams } from "react-router";



export const useHandleItemDeletion = (key: string) => {

    const queryClient = useQueryClient();
    const { id: relation } = useParams();
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    return {
        deleteFn: (id: number) => handleItemDeletion(id, relation ?? '0', queryClient, key, moduleSingle)
    }

}