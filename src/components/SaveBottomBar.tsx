import { useNavigate } from "react-router";
import { FilterButton } from "./FilterButton"
import { SaveButton } from "./saveButton";
import { OrbitProgress } from "react-loading-indicators";

type SaveBottomBarType = {
    saveString?: string;
    onCancel?: () => void;
    onSubmit?: () => void;
    isLoading?: boolean;
    isFullWidth?: boolean;
}

const buttonText = window.location.href.includes('edit') ? 'Update' : 'Save';

export const SaveBottomBar = ({ onCancel, onSubmit, isLoading, isFullWidth, saveString }: SaveBottomBarType) => {

    const navigate = useNavigate();

    const defaultCancelHandler = () => {
        navigate(-1)
    }

    return (
        <div className={`${isFullWidth ? 'w-full left-0' : 'w-[calc(100%_-_180px)] left-[180px]'} flex justify-center gap-5 fixed bottom-0 bg-gray-100 p-3 border-t border-t-gray-200`}>
            <SaveButton type="submit" onClick={onSubmit} disabled={isLoading} className='inline-flex gap-3 items-center'>
                {isLoading && <OrbitProgress style={{ fontSize: "4px" }} color={'white'} variant="track-disc" speedPlus={0} easing="linear" />}
                {saveString ?? buttonText}</SaveButton>
            <FilterButton type="button" onClick={onCancel ? onCancel : defaultCancelHandler} disabled={isLoading}>Cancel</FilterButton>
        </div>
    )
}
