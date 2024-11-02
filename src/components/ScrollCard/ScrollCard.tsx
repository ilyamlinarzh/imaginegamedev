import { ReactNode } from "react"
import './ScrollCard.css'


interface IScrollCardProps {
    children: ReactNode;
    ingame?: boolean;
}

export const ScrollCard = ({
    children,
    ingame = false
}: IScrollCardProps): ReactNode => {
    return(
        <div className={`scroll_card__container scroll_card__container${ingame ? ' scroll_card__container--ingame' : 'default'}`}>
            {children}
        </div>
    )
}