import { Icon28CancelCircleFillRed, Icon28CancelCircleOutline, Icon28CheckCircleOutline, Icon56CancelCircleOutline } from "@vkontakte/icons";
import { Avatar, Banner, Button, CardGrid, CardScroll, Div, Group, Header, HorizontalScroll, List, NavIdProps, Panel, PanelHeader, Placeholder, Snackbar, Text } from "@vkontakte/vkui";
import { FC } from "react";
import { IconCoin } from "../../components/icons/IconCoin/IconCoin";
import { BadgeBox } from "../../components/BadgeBox/BadgeBox";
import { GoodCard } from "../../components/GoodCard/GoodCard";
import { IconMagicCard } from "../../components/icons";
import { gold_backgrounds, gold_color, magic_backgrounds, magic_color, premium_backgrounds, premium_color } from "../../components/GoodCard/backgrounds";
import './Market.css'
import { useAtom } from "jotai";
import { snackbarAtom, userAtom } from "../../storage";
import { ResourcesCard } from "../../components/ResourcesCard/ResourcesCard";
import { useCustomRouteMethods } from "../../hooks/useCustomRouteMethods";
import { api } from "../../api";
import { AxiosError } from "axios";
import bridge from "@vkontakte/vk-bridge";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { declOfNum } from "../../helpers";


export const Market: FC<NavIdProps> = ({id}) => {
    const [me, setMe] = useAtom(userAtom)
    const [snack, setSnack] = useAtom(snackbarAtom)

    const navigate = useRouteNavigator()
    const navigate_ = useCustomRouteMethods()

    const buyGenerations = async (count: 5 | 10 | 20 | 30, cost: number) => {
        const unblock = navigate_.showScreenSpinner()
        const result = await api.market_get_generations(count).catch((err: AxiosError<any>)=>{
            setSnack(
                <Snackbar
                onClose={()=>setSnack(null)}
                offsetY={50}
                >
                    {err.response?.data?.message}
                </Snackbar>
            )
        })
        if (result) {
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

    const buyItem = async (item: string) => {
        await bridge.send('VKWebAppShowOrderBox', {type: 'item', item: item})
        .then((data)=>{
            console.log(data)
            //@ts-ignore
            if (data.success){
                if (item.startsWith('coins')) {
                    const add_coins = Number(item.split('_')[1])
                    setMe((current)=>{
                        if (!current) return current;
        
                        return {...current, balance: current.balance+add_coins}
                    })
                    setSnack(
                        <Snackbar
                        onClose={()=>setSnack(null)}
                        offsetY={50}
                        before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
                        >
                            Баланс пополнен на {add_coins} {declOfNum(add_coins, ['монетку', 'монетки', 'монеток'])}
                        </Snackbar>
                    )
                }
                else if (item.startsWith('premium')) {
                    setMe((current)=>{
                        if (!current) return current;
        
                        return {...current, premium: true}
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
            }
        })
    }

    return(
        <Panel
        mode='card'
        id={id}
        >
            <PanelHeader>Магазин</PanelHeader>
            <Group
            mode='card'
            >
                {me &&
                <CardGrid 
                size="m"
                style={{alignItems:'stretch'}}
                >
                    <ResourcesCard 
                    name="монетки"
                    value={me.balance}
                    afterValue={<IconCoin />}
                    />
                    <ResourcesCard
                    name="генерации карт"
                    value={me.generations}
                    afterValue={<IconMagicCard />}
                    />
                </CardGrid>
                }
                {!me?.premium &&
                <Div>
                    <Banner
                    size='m'
                    mode="image"
                    header="Становитесь нашим слоном"
                    subheader={
                    <span>
                    Премиум игроки могут генерировать больше карточек и имеют много <br/> бонусов!
                    </span>
                    }
                    background={
                        <div
                        style={{
                            backgroundColor: '#A393F4',
                            backgroundImage:
                            'url(https://sun9-39.userapi.com/impg/Nf7RfrWkdvCtoiN0urOWDlAH2dUpdoXRxjyEHA/viTzs5fm3LQ.jpg?size=970x974&quality=95&sign=16f1f4ce1d0eb70a9982c586b3c330f4&type=album)',
                            backgroundPosition: 'right bottom',
                            backgroundSize: 200,
                            backgroundRepeat: 'no-repeat',
                        }}
                        />
                    }
                    actions={
                        <Button 
                        appearance="overlay"
                        onClick={()=>navigate.push('/market/about_premium')}
                        >
                        Подробнее
                        </Button>
                    }
                    />
                </Div>
                }
            </Group>
            {!me?.premium &&
            <Group
            mode='card'
            header={
                <Header mode='secondary'>
                    Имаджингейм Премиум
                </Header>
            }
            >
                <CardScroll style={{boxSizing:'border-box', width:'100%'}} size={false}>
                    <GoodCard 
                    title={<Text className="shadow-text" weight="3">Навсегда</Text>}
                    subtitle="69 голосов"
                    action={
                        <Button 
                        stretched 
                        size='s' 
                        mode='outline' 
                        appearance='overlay'
                        onClick={()=>buyItem('premium')}
                        >
                        Купить
                        </Button>
                    }
                    backgroundColor={premium_color}
                    backgroundImage={`url(${premium_backgrounds[1]})`}
                    />
                    <GoodCard 
                    title={<Text className="shadow-text" weight="2">Месяц</Text>}
                    subtitle="19 голосов"
                    action={
                        <Button 
                        stretched 
                        size='s' 
                        mode='outline' 
                        appearance='overlay'
                        onClick={()=>buyItem('premium_month')}
                        >
                        Купить
                        </Button>
                    }
                    backgroundColor={premium_color}
                    backgroundImage={`url(${premium_backgrounds[0]})`}
                    />
                    <GoodCard 
                    title={<Text className="shadow-text" weight="3">7 дней</Text>}
                    subtitle="150 монеток"
                    action={
                    <Button 
                    stretched size='s' 
                    mode='outline' 
                    appearance='overlay'
                    onClick={()=>navigate.push('/market/buy/premium')}
                    >
                    Купить
                    </Button>
                    }
                    backgroundColor={premium_color}
                    backgroundImage={`url(${premium_backgrounds[1]})`}
                    />
                </CardScroll>
            </Group>
            }
            <Group
            mode='card'
            header={
                <Header mode='secondary'>
                    Генерации
                </Header>
            }
            >
                <CardScroll style={{boxSizing:'border-box', width:'100%'}} size={false}>
                    <GoodCard 
                    title={<><Text className="shadow-text" weight="1">5</Text><IconMagicCard /></>}
                    subtitle="10 монеток"
                    action={
                        <Button 
                        stretched 
                        size='s' 
                        mode='outline' 
                        appearance='overlay'
                        onClick={()=>navigate.push('/market/buy/coins_5')}
                        >
                            Купить
                        </Button>
                    }
                    backgroundColor={magic_color}
                    backgroundImage={`url(${magic_backgrounds[0]})`}
                    />
                    <GoodCard 
                    title={<><Text className="shadow-text" weight="1">10</Text><IconMagicCard /></>}
                    subtitle="20 монеток"
                    action={
                        <Button 
                        stretched 
                        size='s' 
                        mode='outline' 
                        appearance='overlay'
                        onClick={()=>navigate.push('/market/buy/coins_10')}
                        >
                            Купить
                        </Button>
                    }
                    backgroundColor={magic_color}
                    backgroundImage={`url(${magic_backgrounds[1]})`}
                    />
                    <GoodCard 
                    title={<><Text className="shadow-text" weight="1">20</Text><IconMagicCard /></>}
                    subtitle="30 монеток"
                    action={
                        <Button 
                        stretched 
                        size='s' 
                        mode='outline' 
                        appearance='overlay'
                        onClick={()=>navigate.push('/market/buy/coins_20')}
                        >
                            Купить
                        </Button>
                    }
                    backgroundColor={magic_color}
                    backgroundImage={`url(${magic_backgrounds[2]})`}
                    />
                    <GoodCard 
                    title={<><Text className="shadow-text" weight="1">30</Text><IconMagicCard /></>}
                    subtitle="40 монеток"
                    action={
                        <Button 
                        stretched 
                        size='s' 
                        mode='outline' 
                        appearance='overlay'
                        onClick={()=>navigate.push('/market/buy/coins_30')}
                        >
                            Купить
                        </Button>
                    }
                    backgroundColor={magic_color}
                    backgroundImage={`url(${magic_backgrounds[3]})`}
                    />
                </CardScroll>
            </Group>
            <Group
            mode='card'
            header={
                <Header mode='secondary'>
                    Монетки
                </Header>
            }
            >
                <CardScroll style={{boxSizing:'border-box', width:'100%'}} size={false}>
                    <GoodCard 
                    title={<><Text className="shadow-text" weight="1">10</Text><IconCoin /></>}
                    subtitle="2 голоса"
                    action={
                        <Button 
                        stretched 
                        size='s' 
                        mode='outline' 
                        appearance='overlay'
                        onClick={()=>buyItem('coins_10')}
                        >
                        Купить
                        </Button>
                    }
                    backgroundColor={gold_color}
                    backgroundImage={`url(${gold_backgrounds[0]})`}
                    />
                    <GoodCard 
                    title={<><Text className="shadow-text" weight="1">50</Text><IconCoin /></>}
                    subtitle="7 голосов"
                    action={
                        <Button 
                        stretched 
                        size='s' 
                        mode='outline' 
                        appearance='overlay'
                        onClick={()=>buyItem('coins_50')}
                        >
                        Купить
                        </Button>
                    }
                    backgroundColor={gold_color}
                    backgroundImage={`url(${gold_backgrounds[1]})`}
                    />
                    <GoodCard 
                    title={<><Text className="shadow-text" weight="1">100</Text><IconCoin /></>}
                    subtitle="10 голосов"
                    action={
                        <Button 
                        stretched 
                        size='s' 
                        mode='outline' 
                        appearance='overlay'
                        onClick={()=>buyItem('coins_100')}
                        >
                        Купить
                        </Button>
                    }
                    backgroundColor={gold_color}
                    backgroundImage={`url(${gold_backgrounds[2]})`}
                    />
                </CardScroll>
            </Group>
            {snack}
        </Panel>
    )
}