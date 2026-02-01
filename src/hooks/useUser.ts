import { getFromCache } from "@/helpers/helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useUser = () => {

    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const cache = getFromCache('user', queryClient);
            if (cache) return cache;

            const userSaved = await localStorage.getItem('user');
            const isUserLogin = userSaved != null ? true : false;
            const user = isUserLogin ? JSON.parse(userSaved as string) : null;

            return user;
        },
    });
}