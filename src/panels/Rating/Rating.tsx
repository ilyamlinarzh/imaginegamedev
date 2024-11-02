import { Avatar, CardGrid, Div, Group, Header, NavIdProps, Panel, PanelHeader, SimpleCell } from "@vkontakte/vkui";
import { FC, useEffect } from "react";
import { ResourcesCard } from "../../components/ResourcesCard/ResourcesCard";
import { IconRating, IconRepStar } from "../../components/icons";
import { useAtom, useAtomValue } from "jotai";
import { fullRatingAtom, userAtom, userRatingPlaceAtom } from "../../storage";
import { api } from "../../api";
import { BadgeAvatar } from "../../components/BadgeAvatar/BadgeAvatar";

import './Rating.css'
import { Skeleton } from "../../components/Skeleton/Skeleton";



export const Rating: FC<NavIdProps> = ({
    id
}) => {
    const me = useAtomValue(userAtom);

    const [rating, setRating] = useAtom(fullRatingAtom);
    const [mePlace, setMePlace] = useAtom(userRatingPlaceAtom)


    const fetchRating = async () => {
        const rating_response = await api.rating();
        setRating(rating_response.data!.rating)
        setMePlace(rating_response.data!.my_place)
    }

    useEffect(()=>{
        async function fetchData() {
            if(!rating){
                await fetchRating()
            }
        }
        
        fetchData()
    }, [])

    const load = !me || !rating || !mePlace

    const rating_users = rating ? rating.map(user=>user.user_id) : []

    return (
        <Panel
        id={id}
        mode="card"
        >
            <PanelHeader
            shadow={false}
            delimiter="none"
            >
                Рейтинг
            </PanelHeader>
            <Group
            header={<Header mode="primary" size='regular'>Моя статистика</Header>}
            mode="card"
            >
                <CardGrid
                size="m"
                style={{alignItems:'stretch'}}
                >
                    {!load ?
                        <>
                        <ResourcesCard 
                        name="очки рейтинга"
                        value={me.rating}
                        afterValue={<IconRating />}
                        actionName={`${mePlace} место`}
                        />
                        <ResourcesCard 
                        name="репутация"
                        value={me.rep}
                        afterValue={<IconRepStar />}
                        // actionName="о репутации"
                        />
                        </>
                    :
                        <>
                        <Skeleton height={60} />
                        <Skeleton height={60} />
                        </>
                    }
                </CardGrid>
            </Group>
            <Group
            header={<Header mode="primary" size='regular'>Общий рейтинг</Header>}
            mode="card"
            >
                {!load ?
                    <>
                    {rating.map((user, i)=>{
                        const initials = user.name.split(' ').map(s=>s[0]).join('')
                        const n = i+1
                        const color = n == 1 ? 'gold' : n == 2 ? 'silver' : n == 3 ? 'bronze' : 'default';
                        return(
                            <SimpleCell
                            className={user.user_id == me.user_id ? 'user_rating__item--me' : undefined}
                            before={
                                <BadgeAvatar value={n} color={color}>
                                    <Avatar size={48} src={user.avatar} initials={initials} />
                                </BadgeAvatar>
                            }
                            indicator={user.rating}
                            >
                                {user.name}
                                {user.user_id == me.user_id && <span className="user_rating__aftername_text"> Вы</span>}
                            </SimpleCell>
                        )
                    })}
                    
                    {!rating_users.includes(me.user_id) && 
                    <SimpleCell
                    className='user_rating__item--me'
                    before={
                        <BadgeAvatar value={mePlace < 9999 ? mePlace : '...'}>
                            <Avatar size={48} src={me.avatar} />
                        </BadgeAvatar>
                    }
                    >
                        {me.name}
                        <span className="user_rating__aftername_text"> Вы</span>
                    </SimpleCell>
                    }
                    </>
                :
                    <Div>
                    <Skeleton width='100%' height={50} />
                    <Skeleton width='100%' height={50} />
                    <Skeleton width='100%' height={50} />
                    </Div>
                }
                {/* <Skeleton width='100%' height={50} /> */}
            </Group>
        </Panel>
    )
}