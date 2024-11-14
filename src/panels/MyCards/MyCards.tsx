import { Button, CardScroll, Cell, CellButton, Div, Group, Header, Input, Link, NavIdProps, Panel, PanelHeader, SimpleCell, Snackbar, Spacing, Text, Title } from "@vkontakte/vkui";
import { useAtom, useAtomValue } from "jotai";
import { FC, useEffect, useState } from "react";
import { defaultCardsAtom, promptAtom, snackbarAtom, userAtom, userCardsAtom } from "../../storage";
import { PlayCard } from "../../components/Card/Card";
import { ScrollCard } from "../../components/ScrollCard/ScrollCard";
import { BadgeBox } from "../../components/BadgeBox/BadgeBox";
import { IconMagicCard } from "../../components/icons";
import './MyCards.css'
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { PromptCell } from "../../components/PromptCell/PromptCell";
import { Icon24KeyboardOutline } from "@vkontakte/icons";
import { IconEmptyMagicCard } from "../../components/icons/IconMagicCard/IconMagicCard";
import { api } from "../../api";
import { useCustomRouteMethods } from "../../hooks/useCustomRouteMethods";
import { AxiosError } from "axios";



export const MyCards: FC<NavIdProps> = ({id}) => {

    const [me, setMe] = useAtom(userAtom);
    const [cards, setMeCards] = useAtom(userCardsAtom);
    const defaultCards = useAtomValue(defaultCardsAtom)
    const [prompt, setPrompt] = useAtom(promptAtom)

    const navigator = useRouteNavigator()
    const navigator_ = useCustomRouteMethods()

    const [renewing, setRenewing] = useState(false)

    const [snack, setSnack] = useAtom(snackbarAtom)

    useEffect(()=>{
        renewPrompt()
    }, [])

    const openCardsList = () => {
        navigator.push(`/cards/${me?.user_id}`)
    }

    const openDefaultsCards = () => {
        navigator.push('/cards/defaults')
    }

    const renewPrompt = async () => {
        setRenewing(true)
        const newPrompt = await api.generations_random_prompt(prompt)
        setPrompt(newPrompt.data || null)
        setTimeout(() => {
            setRenewing(false)
        }, 1000);
    }

    const pickupCard = async () => {
        const unblock = navigator_.showScreenSpinner()
        
        await api.generations_pickup_card(prompt || '')
        .then((card)=>{
            unblock()
            navigator.push('/cards/generate', {state:{mode:'view', image:card.data?.card?.image}})
            setMe((current)=>{
                if (!current) return current;

                return {
                    ...current,
                    generations: current.generations - 1
                }
            })
            if(card.data?.card){
                setMeCards((current)=>[card.data?.card!, ...current])
            }
        })
        .catch((data: AxiosError<any>)=>{
            console.log(data)
            setSnack(
                <Snackbar
                onClose={()=>setSnack(null)}
                offsetY={50}
                >
                    {data.response?.data.message || 'Не удалось сгенерировать карту'}
                </Snackbar>
            )
        })
        .finally(()=>unblock())

        // if(card?.data?.card){
        //     unblock()
        //     navigator.push('/cards/generate', {state:{mode:'view', image:card.data.card.image}})
        //     return;
        // }
        // unblock()
    }

    return(
        <Panel
        id={id}
        mode='card'
        >
            <PanelHeader
            delimiter="none"
            >
                Карты
            </PanelHeader>
            <Group
            mode='card'
            className='gradient-card--blue'
            >
                <Cell
                after={<BadgeBox value={me?.generations ? me.generations : 0} after={<IconMagicCard />} />}
                >
                    <Title level='3' weight='3'>Сгенерировать карту</Title>
                </Cell>
                <Group
                mode='plain'
                >
                    <Div>
                        <Spacing size={28} />
                        <PromptCell 
                        onClick={renewPrompt}
                        renewing={renewing}
                        >
                            {prompt}
                        </PromptCell>
                        <Spacing size={8} />
                        <CellButton
                        centered
                        before={<Icon24KeyboardOutline/>}
                        onClick={()=>navigator.push('/cards/prompt')}
                        disabled={(me?.generations || 0) <= 0}
                        >
                        Ввести свой запрос
                        </CellButton>
                        <Spacing size={48} />
                        <Button
                        stretched
                        size='l'
                        align='center'
                        onClick={pickupCard}
                        disabled={(me?.generations || 0) <= 0 || !prompt}
                        >
                            <span className='button_text--iconable'>
                                <span>Сгенерировать за 1 </span>
                                <IconEmptyMagicCard />
                            </span>
                        </Button>
                    </Div>
                </Group>
            </Group>
            <Group
            mode='card'
            >
                {cards.length > 0 &&
                <Group
                mode='plain'
                header={
                    <Header 
                    mode='primary' 
                    size='regular'
                    aside={<Link onClick={openCardsList} hasVisited={false}>Управлять</Link>}
                    >
                        Мои карты
                    </Header>
                }
                >
                    <ScrollCard>
                        {cards.map(card=>{
                            return(
                                <PlayCard key={card.card_id} image={card.image} />
                            )
                        })}
                    </ScrollCard>
                </Group>
                }
                <Group
                mode='plain'
                header={
                    <Header 
                    mode='primary' 
                    size='regular'
                    aside={<Link onClick={openDefaultsCards} hasVisited={false}>Посмотреть</Link>}
                    subtitle='Карты из стандартной колоды доступны всем игрокам'
                    multiline
                    >
                        Стандартная колода
                    </Header>
                }
                >
                    <ScrollCard>
                        {defaultCards.map(card=>{
                            return(
                                <PlayCard 
                                key={card.card_id} 
                                image={card.image} 
                                />
                            )
                        })}
                    </ScrollCard>
                </Group>
            </Group>

            {snack}
        </Panel>
    )
}