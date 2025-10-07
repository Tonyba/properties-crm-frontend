import { useUpdates } from '../../hooks/useUpdates'
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import type { GetUpdateResponseType } from '../../helpers/types';
import { Timeline, type TimelineItem } from '../../ui/timeline/Timeline';


const LeadUpdates = () => {

    const queryClient = useQueryClient();
    const { id } = useParams();
    const { data } = useUpdates<GetUpdateResponseType>(id ?? '', queryClient);

    const updates = data?.data;
    const formatted: TimelineItem[] = updates ? updates.map(update => ({
        action: update.action,
        date: update.date,
        user: update.user,
        newData: update.new_data,
        oldData: update.old_data,
        direction: 'right',
        affected: update.affected
    })) : [];

    return (
        <Timeline items={formatted}></Timeline>
    )
}

export default LeadUpdates