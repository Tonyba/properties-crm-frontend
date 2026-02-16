import { useQueryClient } from "@tanstack/react-query";
import { useOffcanvas, useOffcanvasMutation } from "../../hooks/useOffcanvas";
import { useGetSingle } from "@/hooks/useGetSingle";


import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


import { SaveBottomBar } from "../SaveBottomBar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
    to: z.string().trim().min(1, 'Required').and(z.email()),
    subject: z.string().trim().min(1, 'Required'),
    content: z.string(),
    related_id: z.number()
});

import Editor from 'react-simple-wysiwyg';
import { EmailTemplates } from "@/helpers/constants";
import { useAgents } from "@/hooks/useAgents";
import { useState } from "react";
import { sendEmail } from "@/api/email";


const QuickEmail = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const { data } = useGetSingle({});
    const { data: agents } = useAgents();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            to: data?.email ?? '',
            subject: "",
            content: "",
            related_id: data?.id ?? 0
        }
    });

    const queryClient = useQueryClient();
    const { data: offcanvasOpts } = useOffcanvas({ queryClient });
    const { mutate: mutateOffcanvas } = useOffcanvasMutation({ queryClient });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        await sendEmail(values);
        setLoading(false);
    }

    const handleCancel = () => {
        mutateOffcanvas({ queryClient, offCanvasOpts: { ...offcanvasOpts, open: false } })
    }

    const processTemplate = (content: string) => {

        let processContent = content;

        const fullMatches = content.match(/\{[^}]+\}/g);

        fullMatches?.map(match => {
            const key = match.replace('{', '').replace('}', '');
            let value = data[key];
            if (key === 'assigned_to') value = agents?.find(agent => agent.id == value)?.name;
            processContent = processContent.replace(match, value);
        });

        form.setValue('content', processContent);
    }



    return (
        <Form {...form}>
            <form className="space-y-7" onSubmit={form.handleSubmit(onSubmit)}>

                <FormField
                    name="to"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="to">To</Label>
                            <FormControl>
                                <Input
                                    {...field}
                                    id="to"
                                    type="email"
                                    disabled={false}
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
                    name="subject"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="subject">Subject</Label>
                            <FormControl>
                                <Input
                                    {...field}
                                    id="subject"
                                    type="text"
                                    disabled={false}
                                    placeholder="Enter Subject"
                                    className="min-h-12"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                >


                </FormField>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">Select Email template</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-50 p-0">
                        <div className="grid gap-4">
                            {EmailTemplates.map((template, i) => (
                                <Button className="cursor-pointer" variant="link" key={`${i}-etemplate`} onClick={() => processTemplate(template.content)} >{template.name}</Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                <FormField
                    name="content"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="content">Content</Label>
                            <FormControl>
                                <Editor {...field} id="content" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                >


                </FormField>

                <SaveBottomBar isLoading={loading} onCancel={handleCancel} saveString="Send Email" isFullWidth={true} />
            </form>
        </Form>

    )
}

export default QuickEmail;