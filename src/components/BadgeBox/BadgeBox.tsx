import { ReactNode } from "react";
import './BadgeBox.css'
import { Title } from "@vkontakte/vkui";


interface IBadgeBoxProps {
    after?: ReactNode;
    value: string | number;
}

export const BadgeBox = ({
    after,
    value
}: IBadgeBoxProps): ReactNode => {
    return(
        <div className='badge_box'>
            <Title level='3' weight="3">{value}</Title>
            {after && after}
        </div>
    )
}