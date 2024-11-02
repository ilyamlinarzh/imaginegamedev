import {Caption, Div, Group, ModalCard, NavIdProps, Subhead, Title} from "@vkontakte/vkui";
import { FC, ReactNode, useEffect, useRef } from "react";
import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import qr from '@vkontakte/vk-qr';
import './ShareRoom.css'



export const ShareRoom: FC<NavIdProps> = ({id}) => {
    const params = useParams<'room_id'>()
    const navigator = useRouteNavigator()

    const qrRef = useRef<HTMLDivElement>(null);

    const genQR = () => {
        const qrValue = `room:${params?.room_id}`
        const options = {
            isShowLogo: true,
            foregroundColor: 'black'
        }
        const result = qr.createQR(qrValue, options)
        return result
    }

    useEffect(()=>{
        const roomQr = genQR()
        if(qrRef.current){
            qrRef.current.innerHTML = roomQr
        }
    }, [])

    return(
        <ModalCard
        id={id}
        dismissButtonMode="inside"
        header='Приглашение в игру'
        subheader='Отсканируйте QR-код или введите код комнаты в главном меню'
        onClose={()=>navigator.back()}
        >
            <Group>
                <Div
                className="qr_container"
                >
                    <div 
                    className="qr_box"
                    ref={qrRef} 
                    />
                </Div>
                <Subhead className="text--centered text--secondary" weight="2">Код комнаты: {params?.room_id}</Subhead>
            </Group>
        </ModalCard>
    )
}