
import { z } from "zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CompareOpts, fullContactFields, fullLeadFields, fullOpportunityFields, MainModules } from "@/helpers/constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Country } from 'country-state-city';

import { Trash2, Plus } from "lucide-react";
import dayjs from "dayjs";

import { useState } from "react";

import Select from 'react-select';
import type { KeyTaxonomy, SelectOption } from "@/helpers/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAgents } from "@/hooks/useAgents";
import { useMutateTaxonomies, useTaxonomies } from "@/hooks/useTaxonomies";
import { useServices } from "@/hooks/userServices";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerWithRange } from "@/components/DatePickerWithRange";

const compareOptions = z.enum(CompareOpts);



const optionSchema = z.object({
    label: z.string(),
    value: z.string(),
});

const filtersObject = z.object({
    field: z.string().trim().min(1, 'Field is Required'),
    compareOp: compareOptions,
    value: z.string().min(1, 'Value is Required').or(z.array(optionSchema)).or(z.object({ from: z.string(), to: z.string() }))
});

const formSchema = z.object({
    title: z.string().trim().min(1, 'Required'),
    module: optionSchema.nonoptional('Please select a Module'),
    description: z.string().trim().optional(),
    columns: z.array(optionSchema).min(1, 'Select Columns'),
    filters: z.array(filtersObject).min(1, 'Select Filters'),
    group_by: z.string(),
    order_by: z.enum(["asc", "desc"])
});

const todosPaises = Country.getAllCountries();
const countryOpts = todosPaises.map(country => ({ label: country.name, value: country.name }));


const ModuleSelectOpts: SelectOption[] = MainModules.map((opt) => {

    const obj: SelectOption = {
        label: '',
        value: ''
    };

    switch (opt) {
        case 'lead':
            obj.label = 'Leads';
            obj.value = opt;
            break;

        case 'contact':
            obj.label = 'Contacts';
            obj.value = opt
            break;

        case 'opportunity':
            obj.label = 'Opportunies';
            obj.value = opt
    }

    return obj;

});

const AddReport = () => {

    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const [columns, setColumns] = useState<SelectOption[]>([]);
    const { data: agents } = useAgents();
    const { data: services } = useServices();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            module: {},
            description: '',
            columns: [],
            filters: [],
            group_by: '',
            order_by: 'asc'
        }
    });


    const { data: terms } = useTaxonomies(form.getValues('module.value') as KeyTaxonomy);
    const { mutate } = useMutateTaxonomies();

    const handleOnSubmit = (value: z.infer<typeof formSchema>) => {
        console.log('hey')
        console.log(value)
    }

    const handleModuleChange = (module: string) => {

        let fields: SelectOption[] = [];

        switch (module) {
            case 'lead':

                fields = fullLeadFields.map(field => ({
                    label: `(${form.getValues('module.label')}) ${field.label}`,
                    value: `${field.key}-${field.type}`
                }));

                break;

            case 'contact':

                fields = fullContactFields.map(field => ({
                    label: `(${form.getValues('module.label')}) ${field.label}`,
                    value: `${field.key}-${field.type}`
                }));

                break;

            case 'opportunity':

                fields = fullOpportunityFields.map(field => ({
                    label: `(${form.getValues('module.label')}) ${field.label}`,
                    value: `${field.key}-${field.type}`
                }));

                break;
        }

        mutate(module);

        fields.push({
            label: `(${form.getValues('module.label')}) Created At`,
            value: 'created_at-date'
        })

        setColumns(fields)
    }

    const nextStep = async () => {
        // Validamos solo los campos del paso actual antes de avanzar
        let fields = [];

        switch (step) {
            case 2:
                fields = ["columns"];
                break;

            case 3:
                fields = ['filters'];
                break;

            default:
                fields = ["title", "module", 'description'];
                break;
        }

        const isValid = await form.trigger(fields as any);
        if (isValid) setStep((s) => s + 1);
    };

    const prevStep = () => setStep((s) => s - 1);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "filters",
    });

    const comparatorOptions = CompareOpts.map(opt => ({ label: opt, value: opt }));

    const get_select_opts = (key: string): SelectOption[] => {

        let opts: SelectOption[] = [];

        switch (key) {
            case 'assigned_to':
                opts = agents?.map(agent => ({ label: agent.name, value: agent.id.toString() })) ?? [];
                break;

            case 'country':
                opts = countryOpts;
                break;

            case 'requested_property':
                opts = services?.map((service) => ({ label: (service as { title: string; id: number; }).title, value: (service as { title: string; id: number; }).id.toString() })) ?? [];
                break;

            case 'related_services':
                opts = services?.map((service) => ({ label: (service as { title: string; id: number; }).title, value: (service as { title: string; id: number; }).id.toString() })) ?? [];
                break;

            default:

                const taxs = Object.keys(terms ?? {});
                if (terms) taxs.map(tax => {
                    if (tax == key) opts = terms[tax];
                })

                break;
        }



        return opts;
    }



    return <Card className=" mt-10">
        <CardHeader>
            <CardTitle>Report Creation</CardTitle>
            <CardDescription>Step {step} of {totalSteps}</CardDescription>
            <Progress value={(step / totalSteps) * 100} className="h-2" />
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} >
                <CardContent className="space-y-4">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Report Title</Label>
                                <Input id="title" {...form.register("title")} placeholder="Report Title" />
                                {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title?.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="module">Main Module</Label>
                                <Controller
                                    name="module"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={ModuleSelectOpts}
                                            onChange={(selected) => {
                                                field.onChange(selected)
                                                handleModuleChange(selected?.value ?? '');
                                            }}
                                            value={field.value}
                                        />
                                    )}
                                />
                                {form.formState.errors.module && <p style={{ color: 'red' }}>{form.formState.errors.module?.message}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Report Description</Label>
                                <Textarea id="description" {...form.register("description")} placeholder="Report Description" />
                                {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title?.message}</p>}

                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="columns">Columns</Label>
                                <Controller
                                    name="columns"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={columns}
                                            isMulti // Enable multi-select
                                        />
                                    )}
                                />
                                {/* Display error message */}
                                {form.formState.errors.columns && (
                                    <p style={{ color: 'red' }}>{form.formState.errors.columns.message}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="group_by">Group By</Label>
                                    <Controller
                                        name="group_by"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={columns as []}
                                                onChange={(selected) => field.onChange(selected)}
                                                value={field.value}
                                            />
                                        )}
                                    />
                                    {form.formState.errors.module && <p style={{ color: 'red' }}>{form.formState.errors.module?.message}</p>}
                                </div>

                                <FormField
                                    control={form.control}
                                    name="order_by"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Order</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange} // Connects RHF's onChange to RadioGroup
                                                    defaultValue={field.value} // Connects RHF's value to RadioGroup
                                                    className="flex flex-col space-y-1"
                                                >
                                                    {/* Option 1 */}
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="asc" />
                                                        </FormControl>
                                                        <Label htmlFor="asc">Ascending</Label>
                                                    </FormItem>

                                                    {/* Option 2 */}
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="desc" />
                                                        </FormControl>
                                                        <Label htmlFor="desc">Descending</Label>
                                                    </FormItem>

                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage /> {/* Displays validation errors */}
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <Label className="text-lg font-semibold">Report Filters</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ field: '', compareOp: 'equals', value: '' })}
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Filter
                                </Button>
                            </div>

                            {fields.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed rounded-md">
                                    No filters added. Click "Add Filter" to refine your report.
                                </p>
                            )}

                            {fields.filter((item) => item.field != 'state' && item.field != 'city').map((item, index) => (
                                <div key={item.id} className="flex flex-col p-4 border rounded-lg space-y-3 bg-slate-50/50">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold uppercase text-slate-500">Filter #{index + 1}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => remove(index)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Select de Campo */}
                                        <FormField
                                            control={form.control}
                                            name={`filters.${index}.field`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Field</FormLabel>
                                                    <Select
                                                        options={columns}
                                                        value={columns.find(c => c.value === field.value)}
                                                        onChange={(val: any) => field.onChange(val.value)}
                                                        placeholder="Select field..."
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Select de Comparador */}
                                        <FormField
                                            control={form.control}
                                            name={`filters.${index}.compareOp`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Comparator</FormLabel>
                                                    <Select
                                                        options={comparatorOptions}
                                                        value={comparatorOptions.find(o => o.value === field.value)}
                                                        onChange={(val: any) => field.onChange(val.value)}
                                                        placeholder="Operator..."
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Input de Valor */}
                                        <FormField
                                            control={form.control}
                                            name={`filters.${index}.value`}
                                            render={({ field }) => {
                                                // 1. Obtenemos el valor del campo "field" seleccionado para este filtro específico
                                                const selectedFieldValue = form.watch(`filters.${index}.field`);

                                                // 2. Extraemos el tipo (lo que está después del '-')
                                                // Ejemplo: "created_at-date" -> type es "date"
                                                const fieldType = selectedFieldValue?.split("-")[1] || "string";
                                                const fieldKey = selectedFieldValue.split('-')[0];


                                                return (

                                                    <FormItem className="flex flex-col justify-end">
                                                        <FormLabel>Value</FormLabel>
                                                        <FormControl>
                                                            <div>
                                                                {
                                                                    fieldType != 'date' &&
                                                                    fieldType != 'datetimepicker' &&
                                                                    fieldType != 'select'
                                                                    && (
                                                                        <Input
                                                                            {...field}
                                                                            type="text"
                                                                            value={field.value as string}
                                                                            onChange={(e) => field.onChange(e.target.value)} // Mantenerlo como string o convertirlo según prefieras
                                                                        />
                                                                    )
                                                                }

                                                                {
                                                                    fieldType == 'select' &&
                                                                    (
                                                                        <Select
                                                                            // 1. Pasamos la ref para que el enfoque funcione en errores
                                                                            ref={field.ref}
                                                                            // 2. Buscamos el objeto completo que coincide con el string guardado
                                                                            value={field.value}
                                                                            // 3. Al cambiar, solo guardamos el .value (string) en Hook Form
                                                                            onChange={(val: any) => field.onChange(val)}
                                                                            options={get_select_opts(fieldKey)}
                                                                            placeholder="Select..."
                                                                            isMulti
                                                                            // Estilos básicos para que combine con Shadcn (opcional)
                                                                            classNamePrefix="react-select"
                                                                        />

                                                                    )
                                                                }

                                                                {
                                                                    fieldType == 'datetimepicker' ||
                                                                    fieldType == 'date'
                                                                    &&
                                                                    <DatePickerWithRange
                                                                        ref={field.ref}
                                                                        onchange={(val) => {
                                                                            console.log({
                                                                                from: dayjs(val?.from).format('DD/MM/YYYY').toString(),
                                                                                to: dayjs(val?.to).format('DD/MM/YYYY').toString()
                                                                            })
                                                                            field.onChange({
                                                                                from: dayjs(val?.from).format('DD/MM/YYYY').toString(),
                                                                                to: dayjs(val?.to).format('DD/MM/YYYY').toString()
                                                                            })
                                                                        }}
                                                                        value={field.value as { from: string, to: string }}
                                                                    />
                                                                }
                                                            </div>



                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>


                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between mt-5">
                    {step > 1 && (
                        <Button type="button" variant="outline" onClick={prevStep}>
                            Back
                        </Button>
                    )}

                    {step < totalSteps ? (
                        <Button type="button" variant="outline" className="ml-auto" onClick={nextStep}>
                            Next
                        </Button>
                    ) : (
                        <Button type="submit" className="ml-auto bg-green-600 hover:bg-green-700">
                            Save & Generate Report
                        </Button>
                    )}
                </CardFooter>
            </form>

        </Form>

    </Card>
        ;
}

export default AddReport;