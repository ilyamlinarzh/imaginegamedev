import { Card, Spinner } from "@vkontakte/vkui";
import { CSSProperties, HTMLAttributes, ReactNode, useState } from "react";
import './Card.css'
import { Icon28HideOutline } from "@vkontakte/icons";
import { Skeleton } from "../Skeleton/Skeleton";


interface IPlayCardProps extends HTMLAttributes<HTMLDivElement> {
    image: string;
    size?: 's' | 'm';
    hide?: false | true | 'light';
    onClick?: () => void;
}

export const PlayCard = ({
    image,
    size = 's',
    hide = false,
    onClick,
    ...restProps
}: IPlayCardProps): ReactNode => {

    const [loading, setLoading] = useState<boolean>(true)

    const onLoadHandle = () => {
        setLoading(false)
    }

    return(
        <Card
        className='play_card'
        onClick={!loading ? onClick : undefined}
        {...restProps}
        >
            <img 
            src={image}
            style={{display: loading ? 'none' : 'block'}}
            className='play_card__image'
            onLoad={onLoadHandle}
            />
            {hide &&
            <div className={`play_card__hide-cover${hide == 'light' ? '--light' : ''}`}>
                {hide == 'light' ?
                <div className="play_card__hide-cover--icon cover_icon__box">
                    <Icon28HideOutline className="play_card__hide-cover--icon" color="#fff" />
                </div>
                :
                <Icon28HideOutline className="play_card__hide-cover--icon" color="#fff" />
                }
            </div>
            }
            {loading &&
            <div className="play_card__down-cover skeleton--loader"/>
            }
        </Card>
    )
}