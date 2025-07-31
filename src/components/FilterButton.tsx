import tw from "tailwind-styled-components"

interface FilterButtonProps {
    $className?: string;
}

export const FilterButton = tw.button`
    inline-flex
    items-center
    gap-2
    py-1
    cursor-pointer
    px-2.5
    bg-white
    rounded-xs
    border-1
    border-gray-300
    hover:border-gray-500
    ${({ $className }: FilterButtonProps) => $className || ''}
`;