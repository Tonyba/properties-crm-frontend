import type { BoxData, Service } from '@/helpers/types';

type ReadOnlyFieldWithServices = {
    readOnlyFields?: {
        key: string,
        readonly: boolean,
        visible: boolean
    }
} & Service;

export const SummaryRelatedServices = ({ data }: BoxData<ReadOnlyFieldWithServices>) => {
    return <>
        {Array.isArray(data) && data?.map((item) => (
            <div className='flex text-left items-center py-2 not-last:border-b-1 border-gray-300 text-md font-medium' key={item.id}>{item.title}</div>
        ))}
    </>
}
