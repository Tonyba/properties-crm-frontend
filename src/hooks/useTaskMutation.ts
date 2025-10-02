import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import { create_task } from "../api/tasks";
import { useModuleHeader } from "./useModuleHeader";
import type { Activities, SelectOption, Task, TaxonomiesArr } from "../helpers/types";
import moment from "moment";


export const useTaskMutation = () => {

    const params = useParams();
    const queryClient = useQueryClient();
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();


    return useMutation({
        mutationFn: create_task,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/Tasks/${params.leadId}`] });
            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/Activities/${params.leadId}`] });
            await queryClient.invalidateQueries({ queryKey: [`updates/${params.leadId}`] });
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: [`${moduleSingle}/Tasks/${params.leadId}`] });
            await queryClient.cancelQueries({ queryKey: [`${moduleSingle}/Activities/${params.leadId}`] });
            await queryClient.cancelQueries({ queryKey: [`updates/${params.leadId}`] });
        },
        onError: (e) => {
            console.log(e)
        }
    });
}