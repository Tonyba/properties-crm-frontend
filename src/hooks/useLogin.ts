import { login_user } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { enqueueSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router";


export const useLogin = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (variables: { email: string; password: string }) => {
            return login_user(variables.email, variables.password);
        },
        onSuccess: async (resp) => {
            const loginUser = resp.data.data;
            queryClient.setQueryData(['user'], loginUser);
            localStorage.setItem('user', JSON.stringify(loginUser));
            enqueueSnackbar('login successfully!', { variant: 'success' });
            navigate('/');
        },
        onError: (err) => {
            const msg = err.response.data.msg;
            enqueueSnackbar(msg, { variant: 'error' });
        }
    });

}