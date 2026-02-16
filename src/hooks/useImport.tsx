import { type QueryClient, useMutation } from "@tanstack/react-query";
import { useModuleHeader } from "./useModuleHeader";
import { importData } from "@/helpers/helpers";


export const useImport = (queryClient: QueryClient) => {

    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();

    return useMutation({
        mutationFn: importData,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/List`, `${moduleSingle}/List/1`] });
        },
        onMutate: async ({ }) => {
            await queryClient.cancelQueries({ queryKey: [`${moduleSingle}/List`, `${moduleSingle}/List/1`] });
        },
        onError: (e) => {
            console.log(e)
        }
    });

}