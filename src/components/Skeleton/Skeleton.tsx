import { CSSProperties, ReactNode } from "react";
import './Skeleton.css'
import { Card } from "@vkontakte/vkui";


interface ISkeletonProps extends CSSProperties {
    className?: string;
}

export const Skeleton = ({
    className,
    ...cssProps
}: ISkeletonProps): ReactNode => {

    return (
        <Card 
        className={`skeleton skeleton--loader${className ? ` ${className}` : ''}`}
        style={cssProps}
        />
    )
}