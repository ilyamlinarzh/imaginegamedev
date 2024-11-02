import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { Button, FormItem, Group, Input, ModalCard, NavIdProps, Placeholder, Spacing } from "@vkontakte/vkui";
import { FC, useState } from "react";


export const InputRoomId: FC<NavIdProps> = ({id}) => {

    const navigator = useRouteNavigator()

    const [roomValue, setRoomValue] = useState<string>('')

    const close = () => {
        navigator.back()
    }

    const goRoom = () => {
        navigator.replace(`/game/${roomValue}`)
    }

    return(
        <ModalCard
        id={id}
        onClose={close}
        header='Введите код комнаты'
        subheader='Код комнаты отображается у участников комнаты'
        >
            <Group>
                <Spacing size={12} />
                <FormItem
                noPadding
                >
                    <Input 
                    placeholder='Код комнаты'
                    value={roomValue}
                    onChange={(e)=>setRoomValue(e.currentTarget.value)}
                    maxLength={12}
                    />
                </FormItem>
                <Spacing size={12} />
                <Button
                stretched
                size='l'
                align='center'
                disabled={roomValue.length == 0}
                onClick={goRoom}
                >
                    Присоединиться
                </Button>
            </Group>
        </ModalCard>
    )
}