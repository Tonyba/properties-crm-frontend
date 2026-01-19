import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useModuleHeader } from "./useModuleHeader";
import { useNavigate, useParams } from "react-router";
import type { CreateLeadRequest } from "../helpers/types";
import type { AxiosResponse } from "axios";
import { invalidateSingle } from "../helpers/helpers";

type useMutateSingleProps<T> = {
    createFn: (data: T) => Promise<AxiosResponse<CreateLeadRequest, any>>;
    updateFn: (data: T) => Promise<AxiosResponse<CreateLeadRequest, any>>;
    isEditing?: boolean;
    returnBack?: boolean
}

export const useMutateSingle = <T>({ createFn, updateFn, isEditing, returnBack }: useMutateSingleProps<T>) => {
    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams();

    return useMutation({
        mutationFn: !isEditing ? createFn : updateFn,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/list`] });
            await queryClient.invalidateQueries({ queryKey: [`${moduleSingle}/${id}`] });

            await invalidateSingle(moduleSingle ?? 'module', id ?? 'id', moduleSingle ?? 'module', queryClient);

            if (returnBack) navigate(-1);
        }
    });

}
