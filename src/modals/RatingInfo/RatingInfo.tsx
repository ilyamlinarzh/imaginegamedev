import { Button, ModalCard, NavIdProps } from "@vkontakte/vkui";
import { FC } from "react";
import { IconRating, IconRepStar } from "../../components/icons";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";



export const RatingInfo: FC<NavIdProps> = ({id}) => {
    const navigator = useRouteNavigator()

    return(
        <ModalCard
        id={id}
        icon={<IconRepStar width={68} height={68} />}
        header='Репутация'
        subheader='Это ваша оценка, которую ставят другие игроки во время или после игры. Репутация видна в вашем профиле, она может быть положительным или отрицательным числом.'
        onClose={()=>navigator.back()}
        actions={
            <Button stretched size='l' mode='primary' onClick={()=>navigator.back()}>
                Понятно
            </Button>
        }
        >

        </ModalCard>
    )
}