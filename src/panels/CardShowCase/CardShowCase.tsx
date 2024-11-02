import { useMetaParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { Group, NavIdProps, Panel, PanelHeader, PanelHeaderBack, SimpleCell } from "@vkontakte/vkui";
import { FC } from "react";
import { PlayCard } from "../../components/Card/Card";
import './CardShowCase.css'
import { api, Card } from "../../api";
import { Icon28DeleteOutline, Icon28HideOutline, Icon28InfoCircleOutline, Icon28ViewOutline } from "@vkontakte/icons";
import { getDateValue } from "../../helpers";
import { useCustomRouteMethods } from "../../hooks/useCustomRouteMethods";
import { useSetAtom } from "jotai";
import { userCardsRemoveAtom, userCardsUpdateAtom } from "../../storage";



export const CardShowCase: FC<NavIdProps> = ({id}) => {

    const updateCards = useSetAtom(userCardsUpdateAtom)

    const params = useMetaParams<Card<"me">>()
    const navigate_ = useCustomRouteMethods()
    const navigate = useRouteNavigator()

    if(!params){
        return <></>
    }

    const setVisible = async (value: boolean) => {
        const closeSpinner = navigate_.showScreenSpinner()
        const result = await api.cards_set_visible(params.card_id, value)
        updateCards({card_id: params.card_id, visible: result.data})
        params.visible = result.data!
        closeSpinner()
    }

    return (
        <Panel
        id={id}
        mode='card'
        >
            <PanelHeader
            before={<PanelHeaderBack onClick={()=>navigate.back()} />}
            delimiter="none"
            >
                Карта
            </PanelHeader>
            <Group
            mode='card'
            separator="hide"
            >
                <Group
                mode='card'
                className='card-group__background'
                style={{backgroundImage:`url(${params.image})`}}
                separator="hide"
                >
                    <div className="card-group__cardcase">
                        <PlayCard 
                        hide={params.visible ? false : 'light'}
                        image={params.image}
                        />
                    </div>
                    <div className='card-group__blur-cover'/>
                </Group>

                <Group
                mode='card'
                >
                    <SimpleCell
                    before={<Icon28InfoCircleOutline color='var(--vkui--color_icon_secondary)' />}
                    subtitle={`По запросу «${params.user_prompt}»`}
                    multiline
                    >
                        {`Сгенерирована ${getDateValue(params.action_time)}`}
                    </SimpleCell>
                    <SimpleCell
                    before={params.visible ? <Icon28HideOutline /> : <Icon28ViewOutline />}
                    subtitle={params.visible ? 'Другие игроки не смогут видеть её в вашем профиле и она не будет использоваться в играх' : 
                        'Карту смогут увидеть другие игроки и она будет использоваться в играх'
                    }
                    multiline
                    onClick={()=>setVisible(!params.visible)}
                    >
                        {params.visible ? 'Скрыть' : 'Не скрывать'}
                    </SimpleCell>
                    <SimpleCell
                    before={<Icon28DeleteOutline color='var(--vkui--color_icon_negative)' />}
                    subtitle="Карта будет удалена навсегда"
                    onClick={()=>navigate.push('/card/delete', {state: params})}
                    >
                        Удалить
                    </SimpleCell>
                </Group>
            </Group>
        </Panel>
    )
}