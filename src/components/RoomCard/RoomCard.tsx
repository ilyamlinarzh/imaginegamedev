import { Button, Card, List, MiniInfoCell, UsersStack } from "@vkontakte/vkui";
import { ReactNode } from "react";
import './RoomCard.css'
import { Icon20Cards2Outline, Icon20ClockOutline, Icon20UsersOutline } from "@vkontakte/icons";
import { GAMES_CONFIGS } from "../../consts";


interface IRoomCardProps {
    players_count: number;
    players_max: number;
    deck_mode?: "default" | "small";
    avatars: string[];
    onJoin?: () => void;
}

export const RoomCard = ({
    players_count,
    players_max,
    deck_mode = 'default',
    avatars,
    onJoin
}: IRoomCardProps): ReactNode => {
    return(
        <Card className="room_card">
            <div className="room_card__container">
                <div className="room_card__stackbox">
                    <UsersStack size='l' photos={[...avatars]} />
                </div>
                <List>
                    <MiniInfoCell
                    mode="accent"
                    before={<Icon20UsersOutline  />}
                    >
                        {`${players_count}/${players_max} игроков`}
                    </MiniInfoCell>
                    <MiniInfoCell
                    mode="accent"
                    before={<Icon20Cards2Outline />}
                    >
                        {GAMES_CONFIGS[players_max][deck_mode].N} карт
                    </MiniInfoCell>
                    <MiniInfoCell
                    mode="accent"
                    before={<Icon20ClockOutline />}
                    >
                        {`~${GAMES_CONFIGS[players_max][deck_mode].t} мин.`}
                    </MiniInfoCell>
                </List>
                <div className="room_card__buttonbox">
                    <Button stretched mode="primary" size='m' onClick={onJoin}>Войти</Button>
                </div>
            </div>
        </Card>
    )
}