import tw from "tailwind-styled-components";

interface DropdownButtonProps {
    $className?: string;
}

export const DropdownButton = tw.div`
    inline-flex
    items-center
    gap-2
    py-1
    px-2.5
    bg-white
    rounded-xs
    border-1
    border-gray-300
    hover:border-gray-500
    cursor-pointer
    relative
    ${({ $className }: DropdownButtonProps) => $className || ''}
`;

export const DrowpdownContent = tw.div`
    shadow
    p-2
    absolute
    top-full
    right-0 
    bg-white
    min-w-40
    text-sm
    border-gray-300
    border-1
    ${({ $className }: DropdownButtonProps) => $className || ''}
`;