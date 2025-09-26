import { QueryClient, useMutation } from "@tanstack/react-query";
import { create_document } from "../api/documents";
import { useParams } from "react-router";

export const useDocMutation = (queryClient: QueryClient) => {

    const params = useParams();

    return useMutation({
        mutationFn: create_document,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [`Documents/${params.leadId}`] });
        },
        onMutate: async ({ }) => {
            await queryClient.cancelQueries({ queryKey: [`Documents/${params.leadId}`] });
        },
        onError: (e) => {
            console.log(e)
        }
    });
}