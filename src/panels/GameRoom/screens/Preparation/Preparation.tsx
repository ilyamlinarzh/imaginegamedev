import { FC, useEffect, useState } from "react";
import { WSRoomRequestManager } from "../../../../api/ws/requestManager";
import { Card, Div, Group, Title } from "@vkontakte/vkui";


interface IPreparationProps {
    manager: WSRoomRequestManager | null;
}

export const Preparation: FC<IPreparationProps> = ({manager}) => {
    const [timer, setTimer] = useState(5)

    useEffect(()=>{
        const timerInterval = setInterval(() => {
            setTimer(current=>{
                console.log(current)
                if (current >= 1){
                    return current-1
                }else{
                    clearInterval(timerInterval)
                    return current
                }
            })
        }, 1000);

        return () => clearInterval(timerInterval)
    }, [])

    return(
        <>
            <Group>
                <Div>
                    <Card>
                        <Title level='2' weight="2">
                            {`Игра начнется через ${timer}...`}
                        </Title>
                    </Card>
                </Div>
            </Group>
        </>
    )
}