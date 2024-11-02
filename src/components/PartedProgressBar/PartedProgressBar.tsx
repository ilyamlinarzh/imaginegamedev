import { ReactNode } from "react";
import './PartedProgressBar.css'


interface IPartedProgressBarProps {
    part?: number;
    progress?: number;
}

interface IInnerProgressBarProps {
    progress?: number;
}

const InnerProgressBar = ({
    progress = 100
}: IInnerProgressBarProps): ReactNode => {
    const progress_value = progress > 100 ? 100 : progress;
    const smalltime_flasing_mode = progress_value >= 85 && progress_value < 100;
    return(
        <div className={`inner-progressbar__stack${smalltime_flasing_mode ? ' inner-progressbar__stack--smalltime' : ''}`}>
            <div className="inner-progressbar inner-progressbar--background" />
            <div 
            style={{width: `${progress_value}%`}}
            className="inner-progressbar inner-progressbar--active" />
        </div>
    )
}

export const PartedProgressBar = ({
    part = 0,
    progress = 100
}: IPartedProgressBarProps): ReactNode => {

    return(
        <>
        <div className='parted-progressbar__container'>
            <InnerProgressBar progress={part == 1 ? progress : (part > 1 ? 100 : 0)} />
            <InnerProgressBar progress={part == 2 ? progress : (part > 2 ? 100 : 0)} />
            <InnerProgressBar progress={part == 3 ? progress : (part > 3 ? 100 : 0)} />
        </div>
        </>
    )
}