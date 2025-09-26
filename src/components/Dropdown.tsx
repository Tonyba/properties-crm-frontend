import { useState } from 'react';
import { DrowpdownContent } from './DrowdownButton';
import type { ActionOptType } from './SummaryBoxComponents/SummaryBox';

type DrowndownProps = {
    triggerElement: React.ReactNode,
    callback?: Function,
    options: ActionOptType[]
}

export const Dropdown = ({ triggerElement, callback, options }: DrowndownProps) => {

    const [open, setOpen] = useState(false);

    const toggleDropdown = () => {
        if (callback) callback();
        setOpen((open) => !open);
    }


    return (<div className='relative'>
        <div onClick={toggleDropdown}>{triggerElement}</div>
        <DrowpdownContent $open={open} $withAnimation={true} className='min-w-[calc(100%_+_10%)] left-0 right-[unset]'>
            {options.map(({ icon, label, optFn }, key) => (
                <div key={key} className='gap-2 flex items-center px-2 py-2 cursor-pointer hover:bg-gray-100' onClick={() => optFn()}>
                    {icon} {label}
                </div>
            ))}
        </DrowpdownContent>
    </div>

    )
}
