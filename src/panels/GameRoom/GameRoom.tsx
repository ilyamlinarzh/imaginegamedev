import { Alert, NavIdProps, Panel, Spacing } from "@vkontakte/vkui";
import { useAtomValue } from "jotai";
import { FC, ReactNode, useEffect, useState } from "react";
import { roomConfigAtom } from "../../storage";
import { useActiveVkuiLocation, useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { useRoomWebSocket } from "../../hooks/useRoomWebSocket";
import { Lobby } from "./screens/Lobby/Lobby";
import { WSRoomRequestManager } from "../../api/ws/requestManager";
import { useCustomRouteMethods } from "../../hooks/useCustomRouteMethods";
import { Preparation } from "./screens/Preparation/Preparation";
import { Game } from "./screens/Game/Game";
import { End } from "./screens/End/End";

interface ScreenProps {
    state?: string;
    manager: WSRoomRequestManager | null;
    room_id?: string;
}

const Screen = ({state, manager, room_id}: ScreenProps): ReactNode => {
    switch (state) {
        case 'lobby':
            return <Lobby manager={manager} />
        case 'prepare':
            return <Preparation manager={manager} />
        case 'lead_answer':
        case 'players_answers':
        case 'poll':
            return <Game manager={manager} />
        case 'end':
            return <End manager={manager} room_id={room_id}/>
        default:
            return null
    }
}


export const GameRoom: FC<NavIdProps> = ({id}) => {

    const params = useParams<'room_id'>()
    const roomManager = useRoomWebSocket(params?.room_id!)
    const roomConfig = useAtomValue(roomConfigAtom)
       
    const { setPopout } = useCustomRouteMethods()

    const navigator = useRouteNavigator()

    const fetchData = () => {
        roomManager?.get_game_data()
        roomManager?.tell_your_names()
    }

    const openLeaveAlert = (unblock: ()=>void) => {
        const exit = ()=>{
            unblock()
            setPopout(null)
            navigator.back()
        }

        const closePopout = () => {
            setPopout(null)
        }
        setPopout(
            <Alert
                actions={[
                {
                    title: 'Выйти',
                    mode: 'destructive',
                    action: exit,
                },
                {
                    title: 'Отмена',
                    mode:'default',
                    // action: () => {window.history.pushState(null, '', window.location.href)}
                },
                ]}
                actionsLayout="vertical"
                onClose={closePopout}
                header="Подтвердите действие"
                text="Вы уверены, что хотите выйти?"
            />
        )
    }

    useEffect(()=>{
        function blocker() {
            const unblock = navigator.block((value)=>{
                console.log(roomConfig?.state)
                const blockExit = value.nextLocation.pathname == '/' && (roomManager?.ws.readyState != roomManager?.ws.CLOSED) && roomConfig?.state != 'end';
                if (blockExit) {
                    openLeaveAlert(unblock)
                }
                return blockExit
            })
            

            return () => {
                unblock()
            }
        }

        return blocker()
    }, [roomManager])
    

    useEffect(()=>{
        roomManager?.setOnOpen(fetchData)
    }, [roomManager])

    return(
        <>
        <Panel
        id={id}
        mode={['lead_answer', 'players_answers', 'poll'].includes(roomConfig?.state!) ? 'card' : 'plain'}
        >
            <Screen state={roomConfig?.state} manager={roomManager} room_id={params?.room_id} />
        </Panel>
        </>
    )
}