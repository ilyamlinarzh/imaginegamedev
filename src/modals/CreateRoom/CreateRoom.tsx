import { Icon24Cancel, Icon24Dismiss, Icon28CancelCircleOutline } from "@vkontakte/icons";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { Button, FormItem, Group, ModalPage, ModalPageHeader, NavIdProps, PanelHeaderButton, PanelHeaderClose, SegmentedControl, SegmentedControlValue, Snackbar, usePlatform } from "@vkontakte/vkui";
import { FC, useState } from "react";
import { useCustomRouteMethods } from "../../hooks/useCustomRouteMethods";
import { api } from "../../api";
import { players_count_values } from "../../consts";
import { AxiosError } from "axios";
import { useSetAtom } from "jotai";
import { snackbarAtom } from "../../storage";



export const CreateRoom: FC<NavIdProps> = ({id}) => {

    const platform = usePlatform()
    const navigator = useRouteNavigator()
    const navigator_ = useCustomRouteMethods()

    const setSnack = useSetAtom(snackbarAtom);

    const [playersCountInput, setPlayersCountInput] = useState<SegmentedControlValue>('players-3')
    const [roomModeInput, setRoomModeInput] = useState<SegmentedControlValue>('public')
    const [deckModeInput, setDeckModeInput] = useState<SegmentedControlValue>('default')

    const close = () => {
        navigator.back()
    }

    const createRoom = async () => {
        if (typeof playersCountInput !== 'string') return;
        const unblock = navigator_.showScreenSpinner()
        const players_key = playersCountInput as string
        const players_count = players_count_values[players_key]
        //@ts-ignore
        const room_id = await api.rooms_new({players_count, room_mode: roomModeInput, deck_mode: deckModeInput})
        .catch((err: AxiosError<any>) => {
            const message = err.response?.data?.message

            unblock()
            navigator.back()
            setSnack(
                <Snackbar
                onClose={()=>setSnack(null)}
                offsetY={50}
                before={<Icon28CancelCircleOutline fill="var(--vkui--color_icon_negative)" />}
                >
                    {message || 'Пока нельзя создать комнату, попробуйте позже'}
                </Snackbar>
            )
        })
        if (room_id) {
            unblock()
            navigator.replace(`/game/${room_id.data}`)
        }
    }

    const onChangePlayersCount = (value: SegmentedControlValue) => {
        setPlayersCountInput(value)
        if (['players-5', 'players-6', 'players-7'].includes(value as string)) {
            setDeckModeInput('default')
        }
    }

    return(
        <ModalPage
        id={id}
        onClose={close}
        >
            <ModalPageHeader
            noSeparator
            before={
                <>
                {(platform === 'android' || platform === 'vkcom') && (
                    <PanelHeaderClose onClick={close} />
                )}
                </>
            }
            after={
                <>
                {(platform === 'ios') && (
                    <PanelHeaderButton onClick={close}>
                        <Icon24Dismiss />
                    </PanelHeaderButton>
                )}
                </>
            }
            >
                Новая комната
            </ModalPageHeader>
            <Group>
                <FormItem top='Количество игроков'>
                    <SegmentedControl
                    size='m'
                    value={playersCountInput}
                    name="players-count"
                    onChange={(value) => onChangePlayersCount(value)}
                    options={[
                        {
                        label: '3',
                        value: 'players-3',
                        },
                        {
                        label: '4',
                        value: 'players-4',
                        },
                        {
                        label: '5',
                        value: 'players-5',
                        },
                        {
                        label: '6',
                        value: 'players-6',
                        },
                        // {
                        // label: '7',
                        // value: 'players-7',
                        // }
                    ]}
                    />
                </FormItem>
                <FormItem top='Тип комнаты'>
                    <SegmentedControl
                    size="l"
                    value={roomModeInput}
                    name="room-mode"
                    onChange={(value) => setRoomModeInput(value)}
                    options={[
                        {
                        label: 'Публичная',
                        value: 'public',
                        },
                        {
                        label: 'Приватная',
                        value: 'private',
                        }
                    ]}
                    />
                </FormItem>
                <FormItem 
                top='Тип колоды'
                style={['players-5', 'players-6', 'players-7'].includes(playersCountInput as string) ? {opacity:0.6, touchAction:'none', pointerEvents:'none'} : {}}
                >
                    <SegmentedControl
                    size="l"
                    value={deckModeInput}
                    name="deck-mode"
                    onChange={
                        !['players-5', 'players-6', 'players-7'].includes(playersCountInput as string) ?
                        (value) => setDeckModeInput(value) :
                        undefined }
                    options={[
                        {
                        label: 'Стандартная',
                        value: 'default',
                        },
                        {
                        label: 'Уменьшенная',
                        value: 'small',
                        }
                    ]}
                    />
                </FormItem>
                <FormItem>
                    <Button
                    stretched
                    size='l'
                    onClick={createRoom}
                    >
                        Создать комнату
                    </Button>
                </FormItem>
            </Group>
        </ModalPage>
    )
}