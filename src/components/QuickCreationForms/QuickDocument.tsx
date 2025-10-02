import { useEffect, useState, type ChangeEvent } from "react";
import { DocumentUploadFormFields, ValidExt } from "../../helpers/constants";
import { Input, TextArea } from "../InputForm";

import Select from 'react-select';
import { useAgents } from "../../hooks/useAgents";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { SelectOption, Document, Lead } from "../../helpers/types";
import { useParams } from "react-router";
import { useDropzone } from 'react-dropzone'
import { bytesToMegabytes, checkValidFiles, megabytesToBytes, removeFileExtFromFilename } from "../../helpers/helpers";
import { SaveBottomBar } from "../SaveBottomBar";
import { useDocMutation } from "../../hooks/useDocMutation";
import { useSingleLead } from "../../hooks/useSingleLead";
import { useOffcanvas, useOffcanvasMutation } from "../../hooks/useOffcanvas";
import { QuickForm } from "../QuickForm";
import { useTaxonomies } from "../../hooks/useTaxonomies";

const defaultDocument = {} as Document;

const QuickDocument = () => {

    const queryClient = useQueryClient();
    const params = useParams();


    const maxMb = 5;

    const { data } = useQuery(useSingleLead(params.leadId!, false, queryClient));
    const lead = data as Lead;

    const [fields, setFields] = useState(DocumentUploadFormFields);
    const [document, setDocument] = useState<Document>({ ...defaultDocument, relation: parseInt(params.leadId!), assigned_to: lead.assigned_to });
    const { data: agents } = useAgents(queryClient);
    const { data: doc_taxonomies } = useTaxonomies('document');


    const [files, setFiles] = useState<File[]>([]);

    const onDrop = (acceptedFiles: File[]) => {
        const isValid = checkValidFiles(acceptedFiles);
        if (isValid) {
            acceptedFiles.map(file => setDocument((currentDoc) => ({ ...currentDoc, title: removeFileExtFromFilename(file.name) })));
            setFiles(acceptedFiles)
        };
    }


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ValidExt.map(ext => `.${ext}`),
            'application/pdf': [],
        },
        maxFiles: 1,
        maxSize: megabytesToBytes(maxMb)
    });

    const { mutate, status } = useDocMutation(queryClient);

    const handleSave = () => {
        mutate({
            doc: document,
            file: files
        });
    }

    const { data: offcanvasOpts } = useOffcanvas({ queryClient });
    const { mutate: mutateOffcanvas } = useOffcanvasMutation({ queryClient });

    const handleCancel = () => {
        mutateOffcanvas({ queryClient, offCanvasOpts: { ...offcanvasOpts, open: false } })
    }

    useEffect(() => {
        let newFields = [...fields];
        const assigned_index = newFields.findIndex(field => field.key == 'assigned_to');


        if (assigned_index != -1) {
            newFields[assigned_index].options = agents?.map((agent) => ({ label: agent.name, value: agent.id.toString() }));

        }

        if (offcanvasOpts?.customOpts?.external) {
            newFields = DocumentUploadFormFields.filter(field => field.key != 'uploaded_file');
        } else {
            newFields = DocumentUploadFormFields.filter(field => field.key != 'external_url');
        }


        if (doc_taxonomies) {
            const taxs = Object.keys(doc_taxonomies);
            taxs.map(tax => {
                const foundIndex = newFields.findIndex(field => field.key == tax);
                if (newFields[foundIndex]) newFields[foundIndex].options = doc_taxonomies[tax];
            })

            if (offcanvasOpts?.customOpts?.external) {
                const download_type_opts = newFields.find(field => field.key == 'download_type')?.options;
                const external_type = download_type_opts?.find(opt => opt.label == 'External');

                if (external_type) setDocument({ ...document, download_type: external_type?.value })

            } else {
                const download_type_opts = newFields.find(field => field.key == 'download_type')?.options;
                const external_type = download_type_opts?.find(opt => opt.label == 'Internal');

                if (external_type) setDocument({ ...document, download_type: external_type?.value })
            }

        }

        setFields(newFields);

        return () => { }

    }, [doc_taxonomies, offcanvasOpts?.customOpts?.external]);



    return (
        <>
            <QuickForm className="grid grid-cols-2 gap-y-5 gap-x-24">
                {fields.map(({ key, type, label, required, options, placeholder, isClearable }) => (
                    <div className={`flex justify-between ${(type == 'textarea' || type == 'upload' || key == 'title') ? 'col-span-2' : ''}`} key={key}>
                        {(type != 'hidden' && type != 'upload') && <label className="text-sm" htmlFor={key}> {label} {required && <sup className="text-red-500 text-base translate-y-1.5 ml-1 inline-block">*</sup>}</label>}

                        {
                            (type == 'upload') && <div className="flex cursor-pointer items-center justify-center border border-dashed border-blue-400 w-full min-h-40" {...getRootProps()}>
                                <input {...getInputProps()} />
                                {
                                    isDragActive ?
                                        <p>Drop the files here ...</p> :
                                        <p>
                                            {files?.length ?
                                                files?.map((file, i) => (<span key={i}>{file.name} ({bytesToMegabytes(file.size).toFixed(2)}) MB</span>))
                                                : "Drag 'n' drop some files here, or click to select files"
                                            }
                                        </p>
                                }
                            </div>
                        }
                        {
                            (type != 'select' && type != 'textarea' && type != 'upload') && <Input
                                type={type}
                                name={key}
                                placeholder={label}
                                id={key}
                                value={document?.[key as keyof Document] ?? ""}
                                className={key == 'title' ? 'w-[77%]' : 'w-1/2'}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    const currentVal = e.target.value;
                                    let newVal = { ...document };
                                    (newVal as any)[key] = currentVal;
                                    setDocument(newVal);
                                }}
                            />
                        }
                        {
                            type == 'select' && (
                                <Select
                                    className="w-1/2"
                                    isClearable={isClearable}
                                    isSearchable={false}
                                    options={options ?? []}
                                    placeholder={placeholder ?? 'Select...'}
                                    value={options?.find(opt => opt.value == document[key as keyof Document])}
                                    onChange={(selectedOption) => {
                                        let newVal = { ...document };
                                        (newVal as any)[key] = (selectedOption as SelectOption)?.value;
                                        setDocument(newVal);
                                    }}
                                />
                            )
                        }

                        {
                            type == 'textarea' && <TextArea key={key} name={key} id={key} value={document[key as keyof Document]} className="w-[77%]" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                const currentVal = e.target.value;
                                let newVal = { ...document };
                                (newVal as any)[key] = currentVal;
                                setDocument(newVal);
                            }}></TextArea>
                        }

                    </div>
                ))}


            </QuickForm >
            <SaveBottomBar isLoading={status == 'pending'} saveString="Create" onSubmit={handleSave} onCancel={handleCancel} isFullWidth={true} />
        </>

    )
}

export default QuickDocument;