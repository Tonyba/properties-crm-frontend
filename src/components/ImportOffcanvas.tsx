import { ValidImportExt } from "@/helpers/constants";
import * as XLSX from 'xlsx';
import { bytesToMegabytes, checkValidFiles, formatPostType, megabytesToBytes } from "@/helpers/helpers";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { SaveBottomBar } from "./SaveBottomBar";
import { useOffcanvas, useOffcanvasMutation } from "@/hooks/useOffcanvas";
import { useQueryClient } from "@tanstack/react-query";
import { useImport } from "@/hooks/useImport";
import { useModuleHeader } from "@/hooks/useModuleHeader";
import { useNavigate } from "react-router";

const maxMb = 50;

const ImportOffcanvas = () => {

    const [createPath, filter, importBtn, moduleSingle, showCreateBtn] = useModuleHeader();
    const [dataImport, setDataImport] = useState<any[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [counts, setCounts] = useState({
        duplicated: 0,
        failed: 0,
        imported: 0
    });

    const onDrop = (acceptedFiles: File[]) => {

        const isValid = checkValidFiles(acceptedFiles, ValidImportExt);

        if (isValid) {
            setFiles(acceptedFiles);
            handleFiles(acceptedFiles);
        };

    }

    const { mutate: mutateImport, mutateAsync: mutateImportAsync, status } = useImport(queryClient);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'text/csv': ['.csv'],
        },
        maxFiles: 1,
        maxSize: megabytesToBytes(maxMb)
    });

    const { data: offcanvasOpts } = useOffcanvas({ queryClient });
    const { mutate: mutateOffcanvas } = useOffcanvasMutation({ queryClient });

    const handleCancel = () => {
        mutateOffcanvas({ queryClient, offCanvasOpts: { ...offcanvasOpts, open: false } })
        navigate(0);
    }

    const handleFiles = (acceptedFiles: File[]) => {

        const reader = new FileReader();
        const file = acceptedFiles[0];
        reader.onload = (e) => {

            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

            const formatted = jsonData.map((item) => {
                const newItem: Record<string, any> = {};
                Object.entries(item as object).forEach(([key, value]) => {
                    const newKey = key.toLowerCase().replace(/\s+/g, '_');
                    newItem[newKey] = value;
                });
                return newItem;
            });

            setDataImport(formatted);
        };
        reader.readAsArrayBuffer(file);

    }


    const handleImport = async () => {
        try {

            const resp = await mutateImportAsync({
                data: dataImport,
                post_type: formatPostType(moduleSingle ?? '')
            });

            setCounts({
                duplicated: resp.data.duplicated,
                failed: resp.data.failed,
                imported: resp.data.imported
            });
        } catch (err) {
            // manejo de error opcional
            console.log(err)
        }
    }

    return (
        <>
            <div className="flex cursor-pointer items-center justify-center border border-dashed border-blue-400 w-full min-h-40" {...getRootProps()}>
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
            {dataImport.length != 0 && <p> {dataImport.length} {moduleSingle} to import.</p>}

            {status == 'success' && <p> data proccesed! </p>}
            {counts.duplicated && status == 'success' ? <p>Duplicated: {counts.duplicated} of {dataImport.length} Items </p> : <></>}
            {counts.failed && status == 'success' ? <p>Failed to import: {counts.failed} of {dataImport.length} Items</p> : <></>}
            {counts.imported && status == 'success' ? <p>Imported: {counts.imported} of {dataImport.length} Items</p> : <></>}

            <SaveBottomBar isLoading={status == 'pending'} saveString="Import" onSubmit={handleImport} onCancel={handleCancel} isFullWidth={true} />
        </>
    );

}

export default ImportOffcanvas;
