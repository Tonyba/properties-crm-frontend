import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { create_event, edit_event } from "../api/events";
import { useModuleHeader } from "./useModuleHeader";

export const useEventMutation = (action: 'create' | 'edit') => {

    const params = useParams();
    const queryClient = useQueryClient();
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();


    return useMutation({
        mutationFn: action == 'create' ? create_event : edit_event,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/Events/${params.id}`] });
            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/Activities/${params.id}`] });
            await queryClient.invalidateQueries({ queryKey: [`updates/${params.id}`] });
            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/detail/${params.id}/list`] })
        },
        onMutate: async ({ }) => {
            await queryClient.cancelQueries({ queryKey: [`${moduleSingle}/Events/${params.id}`] });
            await queryClient.cancelQueries({ queryKey: [`${moduleSingle}/Activities/${params.id}`] });
            await queryClient.cancelQueries({ queryKey: [`updates/${params.id}`] });
            await queryClient.cancelQueries({ queryKey: [`${moduleSingle}/detail/${params.id}/list`] })
        },
        onError: (e) => {
            console.log(e)
        }
    });
}