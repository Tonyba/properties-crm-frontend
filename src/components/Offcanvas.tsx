import { useQueryClient } from "@tanstack/react-query";
import { useOffcanvas, useOffcanvasMutation } from "../hooks/useOffcanvas"
import { CloseOffcanvas, OffCanvasBody, OffCanvasContent, OffCanvasHeader, OffcanvasInner } from "./OffcanvasBody"
import { FaTimes } from "react-icons/fa";
import loadable from "@loadable/component";
import { QuickTask } from "./QuickCreationForms/QuickTask";
import { QuickEvent } from "./QuickCreationForms/QuickEvent";

const QuickCreationForm = loadable(() => import('../components/QuickCreationForms/QuickDocument'));

export const Offcanvas = () => {

    const queryClient = useQueryClient();
    const { data: offcanvasOpts } = useOffcanvas({ queryClient });
    const { mutate } = useOffcanvasMutation({ queryClient });

    const handleClose = () => {
        mutate({ queryClient, offCanvasOpts: { ...offcanvasOpts, open: false } })
    }

    return (
        <OffCanvasBody $open={offcanvasOpts?.open} $size={offcanvasOpts?.size} >
            <OffcanvasInner $open={offcanvasOpts?.open}>
                <OffCanvasHeader>
                    <h5 className="font-bold text-xl">{offcanvasOpts?.title}</h5>
                    <CloseOffcanvas onClick={handleClose}><FaTimes /></CloseOffcanvas>
                </OffCanvasHeader>
                <OffCanvasContent>
                    {offcanvasOpts?.template && renderComponent(offcanvasOpts.template)}
                </OffCanvasContent>
            </OffcanvasInner>
        </OffCanvasBody>
    )
}



const renderComponent = (component: string) => {

    let form;

    switch (component) {
        case 'document':
            form = <QuickCreationForm />
            break;

        case 'task':
            form = <QuickTask />
            break;

        case 'event':
            form = <QuickEvent />
            break;

        default:
            break;
    }

    return form;

} 