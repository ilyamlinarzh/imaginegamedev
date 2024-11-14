import { Avatar, Caption, Card, Spinner } from "@vkontakte/vkui"
import { HTMLAttributes, ReactNode } from "react"
import './Card.css'
import { Icon20CheckCircleOn, Icon20UserStarBadgeOutline, Icon24DoneOutline } from "@vkontakte/icons";
import { GenBackground } from "../../panels/Generation/GenBackground";


interface IPlayCardProps extends HTMLAttributes<HTMLDivElement> {
    pollMode?: boolean;
    image?: string;
    player_avatar?: string;
    caption?: string;
    selected?: boolean;
    lead_selected?: boolean;
    answered?: boolean;
    me?: boolean;
    onClick?: () => void;
}


export const EmptyCard = (): ReactNode => {
    return(
        <Card
        className='play_card play_card--empty'
        >
            <div className="play_card__hide-cover--icon">
                <Spinner style={{zIndex:999}} size='medium' />
            </div>
            <div className='play_card__down-cover gradient-wave' />
        </Card>
    )
}

export const PlayCardOnDeck = ({
    image,
    player_avatar,
    caption,
    selected = false,
    lead_selected = false,
    answered = false,
    pollMode = false,
    me = false,
    onClick
}: IPlayCardProps): ReactNode => {

    const markAsMe = pollMode && me

    return(
        <Card
        className={`play_card play_card--playempty${selected ? ' play_card--playempty--selected' : ''}${lead_selected ? ' play_card--playempty--leadselected' : ''}`}
        onClick={onClick}
        >
            {(!pollMode && answered) && <div className='play_card__hide-cover play_card--playempty_background' /> }

            {image &&
            <img 
            src={image}
            // style={{display: loading ? 'none' : 'block'}}
            className='play_card__image--deck'
            // onLoad={onLoadHandle}
            />
            }

            {!pollMode &&
            <div
            className='play_card__hide-cover play_card__playercover'
            >
                <Avatar size={32} src={player_avatar} />
                <div>
                    {!(answered || selected) &&
                    <Caption
                    level="3" 
                    weight="3"
                    >
                        {caption?.split(' ').map((word)=><span className='span-wrap'>{word}</span>)}
                    </Caption>
                    }

                    {answered && <Icon24DoneOutline className='accent-color' />}
                </div>
            </div>
            }

            {markAsMe &&
            <div
            className='play_card__hide-cover play_card__playercover--meMark'
            >
                <Avatar size={32} src={player_avatar} />
            </div>
            }

            {selected &&
            <div
            className="play_card__hide-cover play_card__selectedcover"
            >
                <div className="play_card__selectedcover--icon">
                    <Icon20CheckCircleOn />
                </div>
            </div>
            }

            {lead_selected &&
            <div
            className="play_card__hide-cover play_card__selectedcover"
            >
                <div className="play_card__selectedcover--icon play_card__selectedcover--icon--positive">
                    <Icon20UserStarBadgeOutline color="white" />
                </div>
            </div>
            }
        </Card>
    )
}