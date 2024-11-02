import { Counter } from "@vkontakte/vkui";
import { Children, ReactNode } from "react"
import './BadgeAvatar.css'


interface IBadgeAvatarProps {
    color?: "default" | "gold" | "silver" | "bronze"
    value: number | string;
    children: ReactNode;
}


export const BadgeAvatar = ({
    color = "default",
    value,
    children
}: IBadgeAvatarProps): ReactNode => {
    return (
        <div className="badge_avatar">
            {children}
            <Counter className={`badge_avatar__badge badge_avatar__badge--${color}`} size='m'>{value}</Counter>
        </div>
    )
}