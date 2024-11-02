import { Icon56DeleteOutline } from "@vkontakte/icons";
import { useMetaParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { Button, ButtonGroup, ModalCard, NavIdProps } from "@vkontakte/vkui";
import { useSetAtom } from "jotai";
import { FC } from "react";
import { userCardsRemoveAtom } from "../../storage";
import { api, Card } from "../../api";
import { useCustomRouteMethods } from "../../hooks/useCustomRouteMethods";



export const DeleteCard: FC<NavIdProps> = ({id}) => {

    const params = useMetaParams<Card<"me">>()
    const navigate_ = useCustomRouteMethods()
    const navigate = useRouteNavigator()
    const removeFromCards = useSetAtom(userCardsRemoveAtom)

    const removeCard = async () => {
        const closeSpinner = navigate_.showScreenSpinner()
        const result = await api.cards_delete(params?.card_id!)
        navigate.back(2)
        removeFromCards(params?.card_id!)
        closeSpinner()
    }


    return(
        <ModalCard
        id={id}
        icon={<Icon56DeleteOutline color='var(--vkui--color_text_negative)' />}
        header="Удалить карту?"
        subheader='Это действие необратимо'
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
                appearance='negative'
                onClick={removeCard}
                >
                    Удалить
                </Button>
            </ButtonGroup>
        }
        >

        </ModalCard>
    )
}