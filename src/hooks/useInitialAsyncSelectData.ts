import { useQueryClient } from "@tanstack/react-query";
import { useSearchByNameQueryOptions } from "./useSearchByName";

export const useInitialAsyncSelectData = async (ids: string[], moduleSingle: string) => {

    const queryClient = useQueryClient();

    let finalData: { label: string, value: string }[] = [];

    for (const inputValue of ids) {
        const data: any = await queryClient.fetchQuery(useSearchByNameQueryOptions(`search_by/${moduleSingle}/${inputValue}`, inputValue, queryClient));
        const props = Array.isArray(data)
            ? data.map((prop: any) => ({
                label: prop.title,
                value: prop.id.toString(),
            }))
            : [];
        finalData = finalData.concat(props);
    }


    return { initialData: finalData };

}
