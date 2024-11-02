import { Caption, Card, Div, Header, Subhead } from "@vkontakte/vkui";
import { ReactNode } from "react"
import './ConfigCard.css'


interface IConfigCardProps {
    progressbar: ReactNode;
    title?: string;
    subtitle?: string;
    active?: boolean;
}

export const ConfigCard = ({
    progressbar,
    title = '',
    subtitle = '',
    active = false
}: IConfigCardProps): ReactNode => {
    return(
        <Card
        mode='tint'
        className='config-card'
        >
                <div className='config-card__text-container'>
                    <Caption 
                    caps 
                    level='2' 
                    weight='1'
                    className='config-card__text--title'
                    >
                        {title}
                    </Caption>
                    <Subhead weight='3'>{subtitle}</Subhead>
                </div>
                {progressbar}
        </Card>
    )
}