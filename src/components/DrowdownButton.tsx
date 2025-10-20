import tw from "tailwind-styled-components";

interface DropdownButtonProps {
    $className?: string;
}

interface DrowpdownContentProps extends DropdownButtonProps {
    $withAnimation?: boolean,
    $open?: boolean
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
    transition-[opacity,transform,visibility]
    duration-150
    ease-in-out
    z-1
    ${({ $className }: DrowpdownContentProps) => $className || ''}
    ${({ $withAnimation, $open }: DrowpdownContentProps) => ($withAnimation && !$open) ? 'opacity-0 invisible -translate-y-[5%]' : 'translate-y-0 opacity-100 visible'}
`;