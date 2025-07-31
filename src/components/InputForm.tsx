import tw from "tailwind-styled-components"

export const Input = tw.input`
    border-b-1 border-gray-200
    text-sm py-1
    focus:border-blue-500
    focus-visible:outline-0
`

export const TextArea = tw.textarea`
    border-1 border-gray-200
    text-sm py-1
    w-full
    focus-visible:outline-0
    p-2
`;