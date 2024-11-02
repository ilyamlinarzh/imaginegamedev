import { Caption, Card, Headline, Text } from "@vkontakte/vkui"
import { act, CSSProperties, HTMLAttributes, HTMLProps, ReactNode } from "react";
import './GoodCard.css'


interface IGoodCardProps extends CSSProperties {
    title: ReactNode;
    subtitle: string;
    action?: ReactNode;
}

export const GoodCard = ({
    title,
    subtitle,
    action,
    ...cssStyles
}: IGoodCardProps): ReactNode => {
    return(
        <Card className="goodcard" style={cssStyles}>
            <div className="goodcard__title">
                {title}
            </div>
            <div className="goodcard__subtitle">
                <Caption 
                level='1' 
                weight="3"
                style={{color: 'white'}}
                >{subtitle}</Caption>
            </div>
            {action && 
            <div className="goodcard__action">
                {action}
            </div>
            }
        </Card>
    )
}