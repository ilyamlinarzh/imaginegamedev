import { FC, useEffect, useMemo, useState } from "react";
import { WSRoomRequestManager } from "../../../../api/ws/requestManager";
import { Avatar, Button, Card, CardGrid, Group, Header, List, PanelHeader, PanelHeaderButton, Placeholder, SimpleCell } from "@vkontakte/vkui";
import { IconRating } from "../../../../components/icons";
import { IconCoin } from "../../../../components/icons/IconCoin/IconCoin";
import { useAtomValue, useSetAtom } from "jotai";
import { roomConfigAtom, roomRatingAtom, userAtom } from "../../../../storage";
import { api, User } from "../../../../api";
import { Icon16VideoAdvertisement, Icon20BrokenHeartOutline, Icon20VideoOutline } from "@vkontakte/icons";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import bridge, { EAdsFormats } from "@vkontakte/vk-bridge";


interface IEndProps {
    manager: WSRoomRequestManager | null;
    room_id?: string;
}


export const End: FC<IEndProps> = ({manager, room_id}) => {

    const roomConfig = useAtomValue(roomConfigAtom)
    const me = useAtomValue(userAtom)
    const roomRating = useAtomValue(roomRatingAtom)

    const [canShowReward, setCanShowReward] = useState(false)
    const [bonusAdWatched, setBonusAdWatched] = useState(false)

    const setMe = useSetAtom(userAtom)

    const navigator = useRouteNavigator()

    useEffect(()=>{

        async function fetchData () {
            await bridge.send('VKWebAppCheckNativeAds', {ad_format: EAdsFormats.REWARD, use_waterfall:false})
            .then((data)=>{
                if (data.result) {
                    setCanShowReward(true)
                }
            })

            bridge.send('VKWebAppCheckNativeAds', {ad_format: EAdsFormats.INTERSTITIAL, use_waterfall:false})
        }

        if (!bonusAdWatched){
            fetchData()
        }

        return () => {
            async function updateMe (){
                const user = await api.users_me()
                const {cards, ...userData} = user.data!
                setMe(userData)
            }

            if(!bonusAdWatched){
                bridge.send('VKWebAppShowNativeAds', {ad_format: EAdsFormats.INTERSTITIAL})
                .then((data) => {
                    if (data.result)
                        console.log('Реклама показана');
                    else {
                        console.log('Ошибка при показе');
                    }
                })
                .catch((error) => { console.log(error); /* Ошибка */ });
            }

            updateMe()
        } // update user info (without cards-update)
    }, [bonusAdWatched])

    const watchAdBonus = async () => {
        await bridge.send('VKWebAppShowNativeAds', {ad_format: EAdsFormats.REWARD})
        .then(async (data) => {
            if (data.result){
                await api.rooms_get_ad_bonus(room_id!)
                .then((data)=>{
                    setBonusAdWatched(true)
                })
                .catch((err)=>{
                    setBonusAdWatched(true)
                    setCanShowReward(false)
                })
            }
        })
    }

    const rating_players = useMemo<(Partial<User<'other'>>)[] | null>(()=>{
        if (!roomConfig?.metadata) return null;
        //@ts-ignore
        return Object.entries(roomRating).sort((a: string, b: number)=>b[1]-a[1]).map(([user_id, rating])=>{
            const thisPlayer = roomConfig.all_players.find((u)=>u.user_id==user_id)
            return {...thisPlayer, rating: rating}
        })
    }, [roomRating])

    const myRating = me?.user_id ? (roomRating[me.user_id] || 0): 0 
    const myCoins = Math.max(0, Math.floor(myRating/10)) * (me?.premium ? 3 : 1)
    const adBonusCoins = Math.ceil(myCoins*0.5)
    
    const adBonusButton = !(me?.premium) && canShowReward && (adBonusCoins > 0) && !bonusAdWatched;
    return (
        <>
        <PanelHeader
        before={
            <PanelHeaderButton
            style={{color:'var(--vkui--color_icon_negative)'}}
            onClick={()=>navigator.back()}
            >
                Выйти
            </PanelHeaderButton>
        }
        delimiter='none'
        />
        <Group
        >
            <CardGrid size='l'>
                <Card
                className='info-card'
                >
                    <Placeholder
                    header='Игра закончена'
                    >
                    Отличная игра! Сыграем ещё?
                    </Placeholder>
                </Card>
                <Card>
                    <List>
                        <SimpleCell 
                        before={<IconRating />}
                        >
                            {`Очков в рейтинг: ${myRating > 0 ? '+' : ''}${(bonusAdWatched && canShowReward) ? myRating+adBonusCoins : myRating}`}
                        </SimpleCell>
                        <SimpleCell
                        before={<IconCoin />}
                        >
                            <span
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                gap: 8,
                                alignItems: 'center'
                            }}
                            >
                            {`Монет: ${myRating > 0 ? '+' : ''}${myCoins}`}
                            {adBonusButton &&
                            <Button
                            onClick={watchAdBonus}
                            size='s'
                            mode='secondary'
                            before={<Icon16VideoAdvertisement />}
                            >{`Получить бонус +${adBonusCoins}`}</Button>
                            }
                            </span>
                        </SimpleCell>
                    </List>
                </Card>
                {rating_players &&
                <Card>
                    <Header>
                        Результаты игроков
                    </Header>
                    {rating_players.length > 0 ?
                    <List>
                        {rating_players.map(user=>(
                            <SimpleCell
                            key={user.user_id}
                            before={<Avatar size={48} src={user.avatar} />}
                            subtitle={user.rating != undefined && `Рейтинг: ${user.rating}`}
                            >
                                {user.name}
                            </SimpleCell>
                        ))}
                    </List>
                    :
                    <Placeholder
                    header="Пусто!"
                    icon={<Icon20BrokenHeartOutline width={56} height={56} />}
                    >
                        Кажется, в этой игре никто не старался и не успел набрать очки
                    </Placeholder>
                    }
                </Card>
                }
            </CardGrid>
        </Group>
        </>
    )
}
