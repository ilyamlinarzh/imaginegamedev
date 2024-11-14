import { FC } from "react";
import { WSRoomRequestManager } from "../../../../api/ws/requestManager";
import { Avatar, Card, CardGrid, Div, Group, Header, Headline, Link, List, PanelHeader, PanelHeaderButton, Placeholder, SimpleCell, Text, Title } from "@vkontakte/vkui";
import './Lobby.css'
import { useAtomValue } from "jotai";
import { roomConfigAtom } from "../../../../storage";
import { Icon28Cards2Outline, Icon28ClockOutline, Icon28QrCodeOutline, Icon28UsersOutline } from "@vkontakte/icons";
import { GAMES_CONFIGS } from "../../../../consts";
import { declOfNum } from "../../../../helpers";
import { useActiveVkuiLocation, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";


interface ILobbyProps {
    manager: WSRoomRequestManager | null;
}

export const Lobby: FC<ILobbyProps> = ({manager}) => {

    const roomConfig = useAtomValue(roomConfigAtom)

    const navigator = useRouteNavigator()

    const gameTime = GAMES_CONFIGS[roomConfig!.players_max][roomConfig!.deck_mode].t
    const gameCardsCount = GAMES_CONFIGS[roomConfig!.players_max][roomConfig!.deck_mode].N
    const players_max = roomConfig!.players_max 

    const openShare = () => {
        const currentPath = window.location.hash.slice(1)
        navigator.push(`${currentPath}/share`)
    }

    return(
        <>
            <PanelHeader 
            before={
                <PanelHeaderButton
                style={{color:'var(--vkui--color_icon_negative)'}}
                onClick={()=>navigator.back()}
                >
                    Выйти
                </PanelHeaderButton>
            }
            delimiter='none'
            />
            <Group
            >
                <CardGrid size='l'>
                    <Card
                    className='info-card'
                    >
                        <Placeholder
                        header='Ждём игроков...'
                        >
                        {`Игра начнётся автоматически, как только присоединится ${players_max} ${declOfNum(players_max, ['игрок', 'игрока', 'игроков'])}`}
                        </Placeholder>
                    </Card>
                    <Card>
                        <List>
                            <SimpleCell 
                            before={<Icon28UsersOutline />}
                            >
                                {`Комната на ${players_max} ${declOfNum(players_max, ['игрок', 'игрока', 'игроков'])}`}
                            </SimpleCell>
                            <SimpleCell
                            before={<Icon28Cards2Outline />}
                            >
                                {`В колоде ${gameCardsCount} ${declOfNum(gameCardsCount, ['карта', 'карты', 'карт'])}`}
                            </SimpleCell>
                            <SimpleCell
                            before={<Icon28ClockOutline />}
                            >
                                {`Игра займет ~${gameTime} мин.`}
                            </SimpleCell>
                        </List>
                    </Card>
                    <Card>
                        <Header
                        multiline
                        aside={
                            <Link 
                            hasVisited={false}
                            onClick={openShare}
                            >
                            Пригласить
                            </Link>
                        }
                        >
                            Уже присоединились ({`${roomConfig?.players.length}/${players_max}`})
                        </Header>
                        <List>
                            {roomConfig?.players.map(user=>(
                                <SimpleCell
                                key={user.user_id}
                                before={<Avatar size={48} src={user.avatar} />}
                                subtitle={user.rating != undefined && `Рейтинг: ${user.rating}`}
                                >
                                    {user.name}
                                </SimpleCell>
                            ))}
                        </List>
                    </Card>
                </CardGrid>
            </Group>
        </>
    )
}