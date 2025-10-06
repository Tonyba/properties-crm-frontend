import { QueryClient, useMutation } from "@tanstack/react-query";
import { create_document } from "../api/documents";
import { useParams } from "react-router";
import { useModuleHeader } from "./useModuleHeader";

export const useDocMutation = (queryClient: QueryClient) => {

    const params = useParams();
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    return useMutation({
        mutationFn: create_document,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/Documents/${params.leadId}`] });
            await queryClient.invalidateQueries({ queryKey: [`updates/${params.leadId}`] });
            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}-docs/detail/${params.leadId}/list`] });
        },
        onMutate: async ({ }) => {
            await queryClient.cancelQueries({ queryKey: [`${moduleSingle}/Documents/${params.leadId}`] });
            await queryClient.cancelQueries({ queryKey: [`updates/${params.leadId}`] });
            await queryClient.cancelQueries({ queryKey: [`${moduleSingle}-docs/detail/${params.leadId}/list`] });
        },
        onError: (e) => {
            console.log(e)
        }
    });
}