import { Button, Cell, Group, List, MiniInfoCell, ModalCard, NavIdProps, RichCell, SimpleCell, Spacing } from "@vkontakte/vkui";
import { FC } from "react";
import { IconRating, IconRepStar } from "../../components/icons";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { Icon16StarCircleFillYellow, Icon20CoinsOutline, Icon20Users3Outline, Icon24Cards2Outline, Icon24RobotOutline, Icon24Users3Outline, Icon28LikeCircleFillRed, Icon36CoinsStacks2Outline } from "@vkontakte/icons";



export const PremiumInfo: FC<NavIdProps> = ({id}) => {
    const navigator = useRouteNavigator()

    return(
        <ModalCard
        id={id}
        icon={<Icon16StarCircleFillYellow width={68} height={68} />}
        header='Имаджингейм Премиум'
        onClose={()=>navigator.back()}
        actions={
            <Button stretched size='l' mode='primary' onClick={()=>navigator.back()}>
                Понятно
            </Button>
        }
        >
            <Group>
            <List>
                <SimpleCell
                multiline
                before={<Icon24RobotOutline/>}
                subtitle='Вы больше не будете видеть рекламу в приложении'
                >
                    Никакой рекламы
                </SimpleCell>
                <SimpleCell
                multiline
                before={<Icon24Users3Outline/>}
                subtitle='Премиум-игроки всегда начинают игру водящими'
                >
                    Начинайте первым
                </SimpleCell>
                <SimpleCell
                multiline
                before={<Icon36CoinsStacks2Outline width={24} height={24} />}
                subtitle='Получайте в 3 раза больше монет после игры и генерируйте больше игровых карточек'
                >
                    Больше монет
                </SimpleCell>
                <SimpleCell
                multiline
                before={<Icon28LikeCircleFillRed width={24} height={24}/>}
                subtitle='Внесите свой вклад в поддержку проекта и получайте дополнительные секретные бонусы'
                >
                    Поддержка проекта
                </SimpleCell>
            </List>
            </Group>
        </ModalCard>
    )
}