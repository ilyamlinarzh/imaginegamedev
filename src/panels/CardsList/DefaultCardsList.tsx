import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router"
import { CardGrid, Div, Group, NavIdProps, Panel, PanelHeader, PanelHeaderBack } from "@vkontakte/vkui"
import { useAtom } from "jotai"
import { FC, useEffect, useState } from "react"
import { defaultCardsAtom } from "../../storage"
import { api } from "../../api"
import { PlayCard } from "../../components/Card/Card"
import { Skeleton } from "../../components/Skeleton/Skeleton"

export const DefaultCardsList: FC<NavIdProps> = ({id}) => {

    const [defaultCards, setDefaultCards] = useAtom(defaultCardsAtom);

    const navigator = useRouteNavigator()

    const [stopPagination, setStopPagination] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [page, setPage] = useState(0)

    async function loadPage() {

        setLoading(true)
        const offset = defaultCards.length;

        const result = await api.cards_default(15, offset);
        if(!result.data) return;

        if(result.data.length < 15){
            setStopPagination(true)
            window.removeEventListener('scroll', handleScroll)
        }

        setDefaultCards((current)=>[...current, ...result.data!])


        setLoading(false)

    }

    useEffect(()=>{
        loadPage()
    }, [page])

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
                <CardGrid
                size='s'
                >
                    {
                        defaultCards.map((card)=>{
                            return(
                                <PlayCard
                                key={card.card_id}
                                image={card.image}
                                />
                            )
                        })
                    }
                </CardGrid>
                {loading &&
                    <Div>
                        <Skeleton width='100%' height={15} />
                    </Div>
                }
            </Group>
        </Panel>
    )
}