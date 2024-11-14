import { Icon28CancelCircleOutline, Icon28CheckCircleOutline } from "@vkontakte/icons";
import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { Button, ButtonGroup, ModalCard, NavIdProps, Snackbar } from "@vkontakte/vkui";
import { useSetAtom } from "jotai";
import { FC } from "react";
import { snackbarAtom, userAtom } from "../../storage";
import { api } from "../../api";
import { useCustomRouteMethods } from "../../hooks/useCustomRouteMethods";
import { AxiosError } from "axios";

const costs = {
    5: 10,
    10: 20,
    20: 30,
    30: 40
}

export const ConfirmBuy: FC<NavIdProps> = ({id}) => {

    const params = useParams<'item'>()
    const navigate_ = useCustomRouteMethods()
    const navigate = useRouteNavigator()

    const setMe = useSetAtom(userAtom)
    const setSnack = useSetAtom(snackbarAtom)
    
    const buyGenerations = async (count: 5 | 10 | 20 | 30) => {
        const unblock = navigate_.showScreenSpinner()
        const result = await api.market_get_generations(count).catch((err: AxiosError<any>)=>{
            setSnack(
                <Snackbar
                onClose={()=>setSnack(null)}
                offsetY={50}
                before={<Icon28CancelCircleOutline fill="var(--vkui--color_icon_negative)" />}
                >
                    {err.response?.data?.message}
                </Snackbar>
            )
        })
        if (result) {
            const cost = costs[count]
            setMe((current)=>{
                if (!current) return current;

                return {...current, balance: Math.max(current.balance-cost, 0), generations: current.generations+count}
            })
            setSnack(
                <Snackbar
                onClose={()=>setSnack(null)}
                offsetY={50}
                before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
                >
                    Вы купили {count} генераций
                </Snackbar>
            )
        }
        unblock()
    }

    const buyWeekPremium = async () => {
        const unblock = navigate_.showScreenSpinner()
        const result = await api.market_get_week_premium().catch((err: AxiosError<any>) => {
            setSnack(
                <Snackbar
                onClose={()=>setSnack(null)}
                offsetY={50}
                before={<Icon28CancelCircleOutline fill="var(--vkui--color_icon_negative)" />}
                >
                    {err.response?.data?.message}
                </Snackbar>
            )
        })

        if (result) {
            setMe((current)=>{
                if (!current) return current;

                return {...current, premium: true, balance: Math.max(current.balance-150, 0)}
            })
            setSnack(
                <Snackbar
                onClose={()=>setSnack(null)}
                offsetY={50}
                before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
                >
                    Теперь вы премиум-игрок
                </Snackbar>
            )
        }
        unblock()
    }

    const confirm = async () =>{
        if (params?.item?.startsWith('coins_')){
            //@ts-ignore
            await buyGenerations(Number(params?.item.split('coins_')[1]))
        }

        if (params?.item == 'premium') {
            await buyWeekPremium()
        }

        navigate.back()
    }

    return(
        <ModalCard
        id={id}
        header="Подтвердите покупку"
        subheader='Вы действительно хотите купить этот товар?'
        onClose={()=>navigate.back()}
        actions={
            <ButtonGroup mode='horizontal' gap='m' stretched>
                <Button
                stretched
                size='l'
                mode='secondary'
                onClick={()=>navigate.back()}
                >
                    Отмена
                </Button>
                <Button
                stretched
                size='l'
                appearance='accent'
                onClick={confirm}
                >
                    Купить
                </Button>
            </ButtonGroup>
        }
        >

        </ModalCard>
    )
}