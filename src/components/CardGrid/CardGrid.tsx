import { ReactNode } from "react";
import './CardGrid.css'


interface ICardGridProps {
    inLine: 3 | 4;
    children: ReactNode;
}

export const CardGrid = ({
    inLine,
    children
}: ICardGridProps): ReactNode => {

    return(
        <div 
        className={`card_grid card_grid--inline${inLine}`}
        >
            {children}
        </div>
    )
}