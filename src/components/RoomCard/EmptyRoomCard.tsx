import { Card, ToolButton } from "@vkontakte/vkui"
import './RoomCard.css'
import { Icon24Add, Icon28AddOutline } from "@vkontakte/icons"
import { ReactNode } from "react";


interface IEmptyRoomCardProps {
    onClick?: () => void;
}

export const EmptyRoomCard = ({
    onClick
}: IEmptyRoomCardProps): ReactNode => {
    return(
        <Card
        className="room_card--empty"
        onClick={onClick}
        >
            <div className="room_card__container--empty">
                <ToolButton
                direction='column' 
                mode='tertiary'
                IconRegular={Icon28AddOutline}
                IconCompact={Icon24Add}
                >
                    Создать <br/> комнату
                </ToolButton>
            </div>
        </Card>
    )
}