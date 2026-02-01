
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import loginImg from "@/assets/login.jpg";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { useLogin } from "@/hooks/useLogin";
import { Input } from "@/components/ui/input";


const formSchema = z.object({
    email: z.string().trim().min(1, 'Required').and(z.email()),
    password: z.string().trim().min(1, 'Required')
});

const LoginPage = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const { mutate, isPending } = useLogin();

    const handleOnSubmit = (value: z.infer<typeof formSchema>) => {
        mutate({
            email: value.email,
            password: value.password
        });
    }

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 relative">
                <img src={loginImg} className="object-cover absolute top-0 left-0 w-full h-full" alt="Login" />
            </div>
            <div className="w-1/2 bg-blue-500 flex items-center justify-center">
                <div className="bg-white px-5 py-12 max-w-max rounded-sm">
                    <img src={logo} alt="logo" className="max-w-xs mb-10" />
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-7">
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (

                                    <FormItem>

                                        <FormControl>

                                            <Input
                                                {...field}
                                                type="email"
                                                disabled={isPending}
                                                placeholder="Enter Email"
                                                className="min-h-12"
                                            />


                                        </FormControl>
                                        <FormMessage />

                                    </FormItem>


                                )}
                            >


                            </FormField>

                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (

                                    <FormItem>

                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                type="password"
                                                placeholder="Enter Password"
                                                className="min-h-12"
                                            />


                                        </FormControl>
                                        <FormMessage />

                                    </FormItem>


                                )}
                            >


                            </FormField>

                            <Button type="submit" disabled={isPending} size="lg" variant='secondary' className="w-full" >Login</Button>
                        </form>

                    </Form>

                </div>
            </div>
        </div>
    )
}

export default LoginPage;