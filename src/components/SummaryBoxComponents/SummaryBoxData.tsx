import tw from "tailwind-styled-components"
import { SummaryDocuments } from "./SummaryDocuments";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useRelated } from "../../hooks/useRelated";
import type { Activities, Document, Task } from "../../helpers/types";
import { SummaryActivities } from "./SummaryActivities";

type SummaryBoxDataProps = {
    noFoundMessage?: string,
    boxKey: string
}

const SummaryBoxDataContainer = tw.div``;

export const SummaryBoxData = ({ noFoundMessage, boxKey }: SummaryBoxDataProps) => {

    const params = useParams();
    const { data } = useQuery(useRelated(params.id || params.leadId || '', boxKey));

    const List = () => {

        let render;

        switch (boxKey) {
            case 'Documents':
                render = <SummaryDocuments data={data as Document[]} />
                break;

            case 'Activities':
                render = <SummaryActivities data={data as Activities[]} />
                break;

            default:
                break;
        }

        return render;
    }

    return (
        <>
            <SummaryBoxDataContainer>
                <List></List>
            </SummaryBoxDataContainer>
            {
                !data?.length ?
                    noFoundMessage
                        ? noFoundMessage
                        : `No Related ${boxKey}`
                    : ''
            }
        </>
    )
}

