import { FC, useMemo } from "react";
import { WSRoomRequestManager } from "../../../../api/ws/requestManager";
import { Avatar, Card, CardGrid, Group, Header, List, PanelHeader, PanelHeaderButton, Placeholder, SimpleCell } from "@vkontakte/vkui";
import { IconRating } from "../../../../components/icons";
import { IconCoin } from "../../../../components/icons/IconCoin/IconCoin";
import { useAtomValue } from "jotai";
import { roomConfigAtom, roomRatingAtom, userAtom } from "../../../../storage";
import { User } from "../../../../api";
import { Icon20BrokenHeartOutline } from "@vkontakte/icons";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";


interface IEndProps {
    manager: WSRoomRequestManager | null;
}


export const End: FC<IEndProps> = ({manager}) => {

    const roomConfig = useAtomValue(roomConfigAtom)
    const me = useAtomValue(userAtom)
    const roomRating = useAtomValue(roomRatingAtom)

    const navigator = useRouteNavigator()

    const rating_players = useMemo<(Partial<User<'other'>>)[] | null>(()=>{
        if (!roomConfig?.metadata) return null;
        //@ts-ignore
        return Object.entries(roomRating).sort((a: string, b: number)=>b[1]-a[1]).map(([user_id, rating])=>{
            console.log(user_id)
            const thisPlayer = roomConfig.players.find((u)=>u.user_id==user_id)
            console.log(thisPlayer)
            return {...thisPlayer, rating: rating}
        })
    }, [roomRating])

    const myRating = me?.user_id ? (roomRating[me.user_id] || 0): 0 
    const myCoins = Math.floor(myRating/10)
    return (
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
                    header='Игра закончена'
                    >
                    Отличная игра! Сыграем ещё?
                    </Placeholder>
                </Card>
                <Card>
                    <List>
                        <SimpleCell 
                        before={<IconRating />}
                        >
                            {`Очков в рейтинг: ${myRating >= 0 ? '+' : '-'} ${myRating}`}
                        </SimpleCell>
                        <SimpleCell
                        before={<IconCoin />}
                        >
                            {`Монет: + ${myCoins}`}
                        </SimpleCell>
                    </List>
                </Card>
                {rating_players &&
                <Card>
                    <Header>
                        Результаты игроков
                    </Header>
                    {rating_players.length > 0 ?
                    <List>
                        {rating_players.map(user=>(
                            <SimpleCell
                            key={user.user_id}
                            before={<Avatar size={48} src={user.avatar} />}
                            subtitle={user.rating != undefined && `Рейтинг: ${user.rating}`}
                            >
                                {user.name}
                            </SimpleCell>
                        ))}
                    </List>
                    :
                    <Placeholder
                    header="Пусто!"
                    icon={<Icon20BrokenHeartOutline width={56} height={56} />}
                    >
                        Кажется, в этой игре никто не старался и не успел набрать очки
                    </Placeholder>
                    }
                </Card>
                }
            </CardGrid>
        </Group>
        </>
    )
}
