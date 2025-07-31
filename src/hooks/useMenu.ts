import { useEffect, useState } from "react";
import type { RefObject } from "react";


export default function useMenu(quickRef: RefObject<any>): [boolean, () => void] {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);
    }

    useEffect(() => {
        // Add event listener to handle clicks outside the QuickAdd component
        document.addEventListener('click', (event) => {
            if (quickRef.current || event.target instanceof HTMLElement) {
                const el = event.target as HTMLElement;
                if (el.contains(quickRef.current)) {
                    setOpen(false);
                }
            }
        });
        return () => {
            // Cleanup the event listener on component unmount
            document.removeEventListener('click', (event) => {
                if (quickRef.current || event.target instanceof HTMLElement) {
                    const el = event.target as HTMLElement;
                    if (el.contains(quickRef.current)) {
                        setOpen(false);
                    }
                }
            });
        };
    }, []);

    return [open, handleOpen];
}



