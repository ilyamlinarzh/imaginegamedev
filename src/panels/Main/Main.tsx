import { Button, CardGrid, Footer, Group, Header, IconButton, NavIdProps, Panel, PanelHeader, PanelHeaderButton, Placeholder, SimpleCell, Skeleton, ToolButton } from "@vkontakte/vkui";
import { FC, useEffect, useState } from "react";
import { ResourcesCard } from "../../components/ResourcesCard/ResourcesCard";
import { IconMagicCard, IconRating, IconRepStar } from "../../components/icons";
import { Icon28DoorArrowLeftOutline, Icon28ListCheckOutline, Icon28LogoVkOutline, Icon28MessagesOutline, Icon28RefreshOutline, Icon56CancelCircleOutline } from "@vkontakte/icons";
import { IconCoin } from "../../components/icons/IconCoin/IconCoin";
import { Provider, useAtom, useAtomValue } from "jotai";
import { activeRoomsAtom, snackbarAtom, userAtom } from "../../storage";
import { RoomCard } from "../../components/RoomCard/RoomCard";
import { RoomRefreshInterval } from "../../consts";
import { api } from "../../api";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { CARDS_VIEW_PANELS, MARKET_VIEW_PANELS, RATING_VIEW_PANELS } from "../../routes";
import { EmptyRoomCard } from "../../components/RoomCard/EmptyRoomCard";
import './Main.css'
import { useCustomRouteMethods } from "../../hooks/useCustomRouteMethods";
import bridge from "@vkontakte/vk-bridge";


export const MainPanel: FC<NavIdProps> = ({id}) => {

    const navigate = useRouteNavigator()
    const navigate_ = useCustomRouteMethods()

    const me = useAtomValue(userAtom);
    const [rooms, setRooms] = useAtom(activeRoomsAtom);
    const [refreshing, setRefreshing] = useState(false)
    const [delayedRefreshing, setDelayedRefreshing] = useState(false)

    const [snack, setSnack] = useAtom(snackbarAtom)

    const joinByInvite = async () => {
        const canReadQR = await bridge.supportsAsync('VKWebAppOpenCodeReader')
        if (canReadQR){
            await bridge.send('VKWebAppOpenCodeReader')
            .then((data)=>{
                const result = data.code_data
                if(result.startsWith('room:')){
                    const room_id = result.split(':')[1]
                    if (room_id.length == 0) return;
                    navigate.push(`/game/${room_id}`)
                }
            })
        }else{
            navigate.push(`/input_room`)
        }
    }

    const refreshRooms = async () => {
        setRefreshing(true)
        const rooms_response = await api.rooms_actives()
        setRooms(rooms_response.data!)
        setRefreshing(false)
    }

    useEffect(()=>{
        refreshRooms()
        const refreshInterval = setInterval(async () => {
            await refreshRooms();
        }, RoomRefreshInterval);

        return () => clearInterval(refreshInterval);
    }, [])

    useEffect(()=>{
        setTimeout(() => {
            setDelayedRefreshing(refreshing)
        }, 1000*Number(!refreshing));
    }, [refreshing])

    const joinInRoom = async(room_id: string) => {
        const unblock = navigate_.showScreenSpinner()
        const rooms_response = await api.rooms_actives()
        setRooms(rooms_response.data!)
        const room_ids = rooms_response.data?.map(r=>r.room_id)
        console.log(room_ids)
        console.log(Boolean(room_ids))
        unblock()
        if (room_ids?.includes(room_id)){
            navigate.push(`/game/${room_id}`)
        }
    }

    if (!me) {
        return <></>
    }


    return(
        <Panel id={id} mode="card">
            <PanelHeader
            shadow={false}
            delimiter="none"
            >
                Главная
            </PanelHeader>
            <Group
            header={<Header mode="primary" size='regular'>Профиль</Header>}
            mode="card"
            >
                <CardGrid 
                size="m"
                style={{alignItems:'stretch'}}
                >
                    <ResourcesCard 
                    name="монетки"
                    value={me.balance}
                    actionName="в магазин"
                    action={()=>navigate.push(`/${MARKET_VIEW_PANELS.MARKET}`)}
                    afterValue={<IconCoin />}
                    />
                    <ResourcesCard 
                    name="генерации карт"
                    value={me.generations}
                    afterValue={<IconMagicCard />}
                    action={()=>navigate.push(`/${CARDS_VIEW_PANELS.CARDS}`)}
                    actionName="создать карту"
                    />
                    <ResourcesCard 
                    name="очки рейтинга"
                    value={me.rating}
                    afterValue={<IconRating />}
                    action={()=>navigate.push(`/${RATING_VIEW_PANELS.RATING}`)}
                    actionName="в рейтинг"
                    />
                    {/* <ResourcesCard 
                    name="репутация"
                    value={me.rep}
                    afterValue={<IconRepStar />}
                    action={()=>navigate.push('/about_rating')}
                    actionName="о репутации"
                    /> */}
                </CardGrid>
            </Group>

            <Group
            header={
                <Header 
                mode="primary" 
                subtitle="Доступные комнаты"
                aside={
                    <ToolButton
                    IconCompact={Icon28RefreshOutline}
                    IconRegular={Icon28RefreshOutline}
                    rounded
                    mode='tertiary'
                    className={(refreshing || delayedRefreshing) ? 'refresh-button refreshing' : 'refresh-button'}
                    onClick={(refreshing || delayedRefreshing) ? undefined: refreshRooms}
                    >
                    </ToolButton>
                }
                >
                    Играть
                </Header>
            }
            mode="card"
            >
                <CardGrid 
                size='m'
                className='room-cards__grid'
                >
                    {rooms.map((room)=>{
                        return(
                            <RoomCard 
                            key={room.room_id}
                            players_count={room.players_count}
                            players_max={room.players_max}
                            deck_mode={room.deck_mode}
                            avatars={room.players_avatars}
                            onJoin={()=>joinInRoom(room.room_id)}
                            />
                        )
                    })}
                    {(rooms.length > 0 && rooms.length < 10) && <EmptyRoomCard onClick={()=>navigate.push('/create_room')} />}
                </CardGrid>
                {rooms.length == 0 &&
                <Placeholder
                icon={<Icon56CancelCircleOutline />}
                header="Активных комнат нет"
                action={
                    <Button 
                    mode='secondary' 
                    size='s'
                    onClick={()=>navigate.push('/create_room')}
                    >
                        Создать комнату
                    </Button>
                }
                >

                </Placeholder>
                }
            </Group>

            <Group
            header={<Header mode="primary">Ещё</Header>}
            mode="card"
            >   
                <SimpleCell before={<Icon28DoorArrowLeftOutline/>} expandable="always" onClick={joinByInvite}>Присоединиться к игре по коду</SimpleCell>
                <SimpleCell href="https://vk.com/@imaginegame_pub-game-rules" target='_blank' before={<Icon28ListCheckOutline />} expandable="always">Правила игры</SimpleCell>
                <SimpleCell href="https://vk.com/imaginegame_pub" target='_blank' before={<Icon28LogoVkOutline />} expandable="always">Сообщество ВКонтакте</SimpleCell>
                <SimpleCell href="https://vk.me/studio_326" target='_blank' before={<Icon28MessagesOutline />} expandable="always">Связаться с разработчиком</SimpleCell>
            </Group>
            <Footer>v1.5pr</Footer>
            {snack}
            </Panel>
    )
}