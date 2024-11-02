import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { CardGrid, Div, FormStatus, Group, NavIdProps, Panel, PanelHeader, PanelHeaderBack, Spacing, Spinner } from "@vkontakte/vkui"
import { useAtom, useAtomValue } from "jotai"
import { FC, useEffect, useState } from "react"
import { userAtom, userCardsAtom } from "../../storage"
import { api, Card, User, UserFieldsMode } from "../../api"
import { PlayCard } from "../../components/Card/Card"
import { Skeleton } from "../../components/Skeleton/Skeleton"
import { useCustomRouteMethods } from "../../hooks/useCustomRouteMethods"

const SkeletonPlaceholder = () => {
    return (
        <>
            <Skeleton aspectRatio={110/165} height='auto' />
            <Skeleton aspectRatio={110/165} height='auto' />
            <Skeleton aspectRatio={110/165} height='auto' />
        </>
    )
}

export const CardsList: FC<NavIdProps> = ({id}) => {

    const [cards, setCards] = useState<(Card<"other"> | Card<"me">)[] | null>(null)

    const me = useAtomValue(userAtom);
    const [meCards, setMeCards] = useAtom(userCardsAtom);

    const navigator = useRouteNavigator()
    const params = useParams<'user_id'>()

    const [stopPagination, setStopPagination] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [page, setPage] = useState(0)

    const user_key = (me?.user_id == params?.user_id) ? 'me' : params?.user_id

    async function loadPage() {
        if(!user_key) return;

        setLoading(true)
        const card_generic = user_key == 'me' ? 'me' : 'other';
        const offset = cards?.length || 0;

        const result = await api.users_cards<typeof card_generic>(user_key, 15, offset);
        if(!result.data) return;

        if(result.data.length < 15){
            setStopPagination(true)
            window.removeEventListener('scroll', handleScroll)
        }

        setCards(current => {
            if (!current) return result.data!
            return [...current, ...result.data!]
        })

        if (user_key == 'me') {
            if (offset == 0){
                //@ts-ignore
                setMeCards(result.data!)
            }else{
                //@ts-ignore
                setMeCards(current => {
                    return [...current, ...result.data!]
                })
            }
        }


        setTimeout(() => {
            setLoading(false)
        }, 500);

    }

    useEffect(()=>{
        loadPage()
    }, [page])

    useEffect(()=>{
        if (user_key == 'me'){
            setCards(meCards)
        }
    }, [])

    const handleScroll = () => {
        if (stopPagination) return;

        const alreadyScroll = document.documentElement.scrollTop+ window.innerHeight
        const allScrollSize = document.documentElement.scrollHeight
        if ( (alreadyScroll <= 0.75*allScrollSize) || loading) return;

        setPage((current)=>current+1);
    }

    useEffect(()=>{
        window.addEventListener('scroll', handleScroll);
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading])

    const goBack = () => navigator.back()

    return (
        <Panel
        id={id}
        mode='card'
        >
            <PanelHeader
            before={<PanelHeaderBack onClick={goBack} />}
            >
                Карты
            </PanelHeader>
            <Group
            mode='card'
            >
                {user_key == 'me' &&
                    <Div>
                        <FormStatus mode='default' header="Выберите карту, чтобы рассмотреть, скрыть или удалить её">
                            Карты игроков случайно распределяются между всеми в игровой комнате. Среди ваших карт в приоритете будут сгенерированные недавно.
                        </FormStatus>
                    </Div>
                }
                <CardGrid
                size='s'
                >
                    {cards ?
                        cards.map((card)=>{
                            return(
                                <PlayCard 
                                onClick={()=>navigator.push('/card', {state:card})}
                                key={card.card_id}
                                image={card.image}
                                // @ts-ignore
                                hide={user_key == 'me' && !card.visible}
                                />
                            )
                        })
                    :
                        <SkeletonPlaceholder />
                    }
                </CardGrid>
                {(loading && cards) &&
                    <Div>
                        <Skeleton width='100%' height={15} />
                    </Div>
                }
            </Group>
        </Panel>
    )
}