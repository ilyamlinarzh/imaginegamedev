import { FC, KeyboardEvent, KeyboardEventHandler, MouseEvent, useEffect, useState } from "react";
import { WSRoomRequestManager } from "../../../../api/ws/requestManager";
import { useAtomValue, useAtom } from "jotai";
import { roomConfigAtom, roomCurrentAssociationAtom, roomMyCardsAtom, roomMyChoicesAtom, roomRatingAtom, roomUsersActionListAtom, userAtom } from "../../../../storage";
import { PlayCard } from "../../../../components/Card/Card";
import { Avatar, Caption, Div, Group, HorizontalCell, HorizontalScroll, PanelHeader, PanelHeaderButton, WriteBar, WriteBarIcon } from "@vkontakte/vkui";
import { ScrollCard } from "../../../../components/ScrollCard/ScrollCard";
import { PartedProgressBar } from "../../../../components/PartedProgressBar/PartedProgressBar";
import { ConfigCard } from "./components/ConfigCard/ConfigCard";
import './Game.css'
import { PlayCardOnDeck } from "../../../../components/Card/EmptyCard";
import { defaultHeight, defaultWidth, game_times } from "../../../../consts";
import { Icon16DonateOultine } from "@vkontakte/icons";
import { GameDeck } from "./components/GameDeck/GameDeck";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { useCustomRouteMethods } from "../../../../hooks/useCustomRouteMethods";
import bridge from "@vkontakte/vk-bridge";


const numedParts: {[key: string]: number} = {
    'lead_answer': 1,
    'players_answers': 2,
    'poll': 3
}

interface IGameProps {
    manager: WSRoomRequestManager | null;
}

export const Game: FC<IGameProps> = ({manager}) => {

    const roomConfig = useAtomValue(roomConfigAtom)
    const roomRating = useAtomValue(roomRatingAtom)
    const myCards = useAtomValue(roomMyCardsAtom)
    const me = useAtomValue(userAtom)

    const otherStorage = useCustomRouteMethods()

    const navigator = useRouteNavigator()

    const actionUsersList = useAtomValue(roomUsersActionListAtom)
    const [myChoices, setMyChoices] = useAtom(roomMyChoicesAtom)

    const association = useAtomValue(roomCurrentAssociationAtom)

    const [timer, setTimer] = useState(0)

    const [leadChoice, setLeadChoice] = useState(0)
    const [leadValue, setLeadValue] = useState<string>('')

    useEffect(()=>{
        const interval = setInterval(() => {
            setTimer(current=>{
                const next = current+0.5
                if (myChoices[0] != 0 && next >= 3 && roomConfig?.state == 'lead_answer'){
                    setMyChoices(c=>[0, c[1]])
                }
                return next
            })
        }, 500);

        setLeadChoice(0)
        setLeadValue('')

        return () => {
            setTimer(0);
            clearInterval(interval);
        }
    }, [roomConfig?.state])

    const onClickCard = (card_id: number) => {
        setMyChoices(c=>[c[0], card_id])
        manager?.player_answer_poll(card_id)
    }

    const answerCard = (card_id: number) => {
        if (myChoices[0] == 0) {
            manager?.player_answer(card_id)
        }
    }

    const answerLead = () => {
        manager?.lead_answer(leadValue, leadChoice)
    }

    const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            answerLead();
        }
    }

    const getConfigTitle = (): string => {
        if (me?.user_id == roomConfig?.lead){
            if (roomConfig?.state == 'lead_answer') { return 'Ваш ход' }
            else if (roomConfig?.state == 'players_answers') { return 'Дождитесь других игроков' }
            else{ return 'Дождитесь других игроков' }
        }else{
            if (roomConfig?.state == 'lead_answer') { return 'Дождитесь ведущего' }
            else if (roomConfig?.state == 'players_answers'){ return 'Ассоциация ведущего' }
            else { return 'Какую карту выбрал ведущий?' }
        }
    }

    const getConfigSubtitle = (): string => {
        if (me?.user_id == roomConfig?.lead){
            if (roomConfig?.state == 'lead_answer') { return 'Выберите любую карту из своей колоды и придумайте к ней ассоциацию' }
            else if (roomConfig?.state == 'players_answers') { return 'Игроки выбирают карту' }
            else {return 'Игроки ищут карту ведущего'}
        }else{
            if (roomConfig?.state == 'lead_answer') { return 'Ведущий выбирает карту и придумывает ассоциацию' }
            else if (roomConfig?.state == 'players_answers') { return association }
            else{ return association }
        }
    }

    const setViewHeight = async () => {
        var defH = defaultHeight
        await bridge.send('VKWebAppCheckBannerAd').then((data)=>{
            if(data.result){
                console.log(data)
                const dpBannerHeight = (defaultWidth*data.banner_height)/data.banner_width
                defH = defaultHeight - dpBannerHeight
            }else{
                defH = defaultHeight
            }
        })
        .catch((err)=>{
            defH=defaultHeight
        })
        document.documentElement.style.setProperty('--view-height', `${defH}px`);
    }

    useEffect(()=>{
        window.addEventListener('resize', setViewHeight);

        return () => {
            window.removeEventListener('resize', setViewHeight);
            document.documentElement.style.setProperty('--view-height', `100dvh`);
        }
    }, [])

    const state = roomConfig?.state
    const result_mode = timer <= 3 && Boolean(roomConfig?.metadata)

    const state_time = state == 'lead_answer' ? game_times.lead_answer : game_times.players_answers;

    return(
        <>
            <div className="game-screen">
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
                mode='card'
                separator="hide"
                >
                    <HorizontalScroll
                    showArrows
                    inline
                    >
                        {roomConfig?.sequence ?
                        roomConfig.sequence.map((user_id)=>{
                            const user = roomConfig.players.find(p=>p.user_id==user_id)
                            if (!user) return null

                            const name = user.name?.split(' ')[0]
                            const player_points = user.user_id ? (roomRating[user.user_id] ? roomRating[user.user_id] : 0) : 0

                            return(
                                <HorizontalCell
                                key={user.user_id}
                                header={name}
                                style={{whiteSpace: 'nowrap'}}
                                subtitle={
                                    <span className='score-container'>
                                        {player_points}
                                        <Icon16DonateOultine />
                                    </span>
                                }
                                >   
                                    <div className="playeravatar__container">
                                        <Avatar size={44} src={user.avatar} />
                                        <div 
                                        style={{opacity: user.user_id == roomConfig.lead ? 1 : 0}}
                                        className="playeravatar__text"
                                        >
                                            <Caption level='3' weight='2'>ВЕДУЩИЙ</Caption>
                                        </div>
                                    </div>
                                </HorizontalCell>
                            )
                        })
                        :
                        roomConfig?.players.map((user)=>{
                            const name = user.name?.split(' ')[0]
                            const player_points = user.user_id ? (roomRating[user.user_id] ? roomRating[user.user_id] : 0) : 0
                            return(
                                <HorizontalCell
                                key={user.user_id}
                                header={name}
                                style={{whiteSpace: 'nowrap'}}
                                subtitle={
                                    <span className='score-container'>
                                        {player_points}
                                        <Icon16DonateOultine />
                                    </span>
                                }
                                >
                                    <Avatar size={44} src={user.avatar} />
                                </HorizontalCell>
                            )
                        })}
                    </HorizontalScroll>
                </Group>

                <div
                className="game-screen__playtable"
                >
                    <GameDeck
                    result_mode={result_mode}
                    onCardClick={onClickCard}
                    />
                </div>

                <Group
                separator='hide'
                className='bottom-cardsholder'
                >
                    <Div>
                        <ConfigCard 
                        progressbar={
                            <PartedProgressBar 
                            part={state ? numedParts[state] : 0} 
                            progress={100*(timer/state_time)} 
                            />
                        }
                        title={getConfigTitle()}
                        subtitle={getConfigSubtitle()}
                        />
                        {leadChoice != 0 && 
                        <WriteBar
                        style={{ resize: 'none' }}
                        maxLength={30}
                        onChange={leadValue.length > 0 ? (e)=>setLeadValue(e.currentTarget.value) : undefined}
                        onKeyDown={handleKeyDown}
                        placeholder="Введите свою ассоциацию"
                        />
                        }
                    </Div>
                    <ScrollCard ingame>
                        {myCards.map((card_id: number)=>{
                            const card_image = localStorage.getItem(`card:${card_id}`)
                            return(
                                <PlayCardOnDeck
                                pollMode
                                selected={leadChoice == card_id}
                                onClick={
                                    roomConfig?.state == 'players_answers' ? 
                                    () => answerCard(card_id) : 
                                        (roomConfig?.state == 'lead_answer' && roomConfig.lead == me?.user_id) ?
                                            () => setLeadChoice(card_id) :
                                                undefined
                                }
                                image={card_image || ''}
                                />
                            )
                        })}
                    </ScrollCard>
                </Group>
            </div>
        </>
    )
}