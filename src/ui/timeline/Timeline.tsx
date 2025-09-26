import tw from "tailwind-styled-components";
import { Fragment } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { capitalizeFirstLetter } from "../../helpers/helpers";

type EventCardProps = {
    action: string,
    date: string,
    user: string,
    newData?: string,
    oldData?: string,
    affected?: string
}

export type TimelineItem = {
    direction: 'left' | 'right',
} & EventCardProps

interface TimeLineProps {
    items: TimelineItem[],
}


export const Timeline = ({ items }: TimeLineProps) => {
    return (
        <div className="flex flex-col gap-y-3 w-full my-4  max-w-2xl">
            <Circle />

            {items.map(({ direction, action, date, user, newData, oldData, affected }, i) => (
                <Fragment key={i}>

                    <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center mx-auto">

                        {
                            direction === 'left'
                                ? <EventCard action={action} date={date} user={user} newData={newData} oldData={oldData} affected={affected}></EventCard> : <div></div>
                        }

                        <Pillar />

                        {
                            direction === 'right'
                                ? <EventCard action={action} date={date} user={user} newData={newData} oldData={oldData} affected={affected}></EventCard> : <div></div>
                        }

                    </div>
                    {i < (items.length - 1) && <Circle />}
                </Fragment>
            ))}
            <Circle />
        </div>
    )
}

const Circle = tw.div`
   bg-gradient-to-r from-blue-500 to-teal-500 rounded-full w-4 h-4  mx-auto
`;

const Pillar = tw.div`
   bg-gradient-to-b from-blue-500 to-teal-500 rounded-t-full rounded-b-full w-2 h-full  mx-auto
`;



const EventCard = ({ action, date, user, oldData, newData, affected }: EventCardProps) => {
    return <div className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl flex flex-col gap-y-2 border shadow-md rounded-xl p-4" >
        <div className="text-blue-800 font-bold text-lg border-b">{user} {action} {capitalizeFirstLetter(affected ?? '')}</div>
        <div className="text-sm text-gray-700">{date}</div>
        {
            (oldData && newData)
            && <div className="grid grid-cols-2 gap-5 border-t">
                <div>
                    <h3 className="uppercase font-bold underline italic" >Old: </h3>
                    {ReactHtmlParser(oldData)}
                </div>
                <div>
                    <h3 className="uppercase font-bold underline italic">New: </h3>
                    {ReactHtmlParser(newData)}
                </div>
            </div>
        }
    </div>
}
