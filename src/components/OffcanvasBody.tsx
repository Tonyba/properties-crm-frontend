import tw from "tailwind-styled-components";

interface OffCanvasBodyProps {
    $open: boolean
}

interface OffcanvasBodyExtensions extends OffCanvasBodyProps {
    $size: 'sm' | 'xl'
}

export const OffCanvasBody = tw.div`
    h-full 
    fixed 
    top-0
    right-0
    transition
    invisible
    ${({ $size }: OffcanvasBodyExtensions) => $size == 'xl' ? `w-[50vw]` : ' w-[30vw]'}
    ${({ $open }: OffcanvasBodyExtensions) => $open && `visible before:z-10
    before:fixed
    before:top-0
    before:left-0
    before:w-full
    before:h-full
    before:bg-black
    before:opacity-25` }
`;

export const OffcanvasInner = tw.div`
    bg-white
    relative
    w-full
    h-full
    z-20
    translate-x-full
    transition-transform
    duration-300
    ease-in-out
    ${({ $open }: OffCanvasBodyProps) => $open && 'translate-x-0'}
`;

export const OffCanvasHeader = tw.div`
   flex justify-between items-center px-5 py-4
   bg-blue-500 text-white 
`;

export const OffCanvasContent = tw.div`
    overflow-y-auto
    p-4
    h-full
`;

export const CloseOffcanvas = tw.button`
    flex
    items-center 
    justify-center 
    w-6 h-6 
    hover:bg-blue-800
    cursor-pointer rounded-full 
`; 