import tw from "tailwind-styled-components";

interface SingleBoxContainerProps {
    $className?: string;
}

interface SingleBoxTitleProps {
    $className?: string;
}



export const SingleBoxContainer = tw.div<SingleBoxContainerProps>`
    p-2
    border-1
    border-gray-200
    shadow
    w-full
    ${({ $className }: SingleBoxContainerProps) => $className || ''}
`;

export const SingleBoxTitle = tw.h2<SingleBoxTitleProps>`
    text-sm
    font-semibold
    border-b-1
    border-gray-300
    pb-2
    mb-3
    flex
    items-center
    gap-1
    ${({ $className }: SingleBoxTitleProps) => $className || ''}
`;


