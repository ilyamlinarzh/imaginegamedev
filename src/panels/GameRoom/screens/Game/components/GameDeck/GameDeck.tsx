import { ReactNode } from "react";
import { useAtomValue } from "jotai";
import { roomConfigAtom, roomMyChoicesAtom, roomUsersActionListAtom, userAtom } from "../../../../../../storage";
import { Spinner } from "@vkontakte/vkui";
import { PlayCardOnDeck } from "../../../../../../components/Card/EmptyCard";
import '../../Game.css';

interface IGameDeckProps {
    result_mode: boolean;
    onCardClick?: (card_id: number) => void;
}

export const GameDeck = ({
    result_mode = false,
    onCardClick = () => {}
}: IGameDeckProps): ReactNode => {

    const roomConfig = useAtomValue(roomConfigAtom)
    const myChoices = useAtomValue(roomMyChoicesAtom)
    const actionUsersList = useAtomValue(roomUsersActionListAtom)
    const me = useAtomValue(userAtom)

    const state = roomConfig?.state
    const lead = roomConfig?.lead
    const metadata = roomConfig?.metadata

    const cardsMapMode = state == 'players_answers' || 
                        (state == 'poll' && !result_mode) || 
                        (state == 'lead_answer' && result_mode);
    
    if (state == 'poll' && result_mode) {
        return <Spinner size='regular' />
    }

    if (state == 'lead_answer' && (!result_mode || !metadata?.round_results)) {
        return(
            <div
            className='playtable__leadcard playtable--appearance'
            >
                <PlayCardOnDeck 
                // selected
                player_avatar={roomConfig?.players.find(p=>p.user_id === roomConfig.lead)?.avatar}
                caption={roomConfig?.lead === me?.user_id ? 'выберите карту и ассоциацию' : 'выбирает карту и ассоциацию'}
                />
            </div>
        )
    }

    const cardCount = Math.max( (roomConfig?.players.length || 0), (metadata?.players_cards?.length || 0) )

    if (cardsMapMode) {
        return(
            <div
            className='playtable__playerscards playtable--appearance'
            >
                {Array.from({length: cardCount}, (_, i)=>{
                    const user = roomConfig?.players?.[i] || null;
                    const user_id = user?.user_id || null;
                    const card_id = metadata?.players_cards?.[i] || null;
                    const image_url = card_id ? (localStorage.getItem(`card:${card_id}`) || undefined) : undefined

                    const lead_selected = state == 'lead_answer' && metadata?.round_results?.lead_card == card_id && result_mode;
                    const selected = card_id == myChoices[1] && !result_mode;
                    const pollOrResult = state == 'poll' || (result_mode && state == 'lead_answer')
                    const answered = (!result_mode && user_id && actionUsersList.includes(user_id)) || user_id == lead || false;
                    const meCard = card_id == myChoices[0]
                    const canClick = state == 'poll' && card_id && !meCard

                    return(
                        <PlayCardOnDeck 
                        key={i}
                        lead_selected={lead_selected}
                        selected={selected}
                        pollMode={pollOrResult}
                        answered={answered}
                        player_avatar={!meCard ? user?.avatar : me?.avatar}
                        image={image_url}
                        me={meCard}
                        onClick={canClick ? ()=>onCardClick(card_id) : undefined}
                        />
                    )
                })}
            </div>
        )
    }

    return null

    // if (cardsMapMode) {
    //     <div
    //     className='playtable__playerscards'
    //     >
    //         {roomConfig?.players.map((user, i)=>{
    //             const card_id = roomConfig.metadata?.players_cards?.[i] || null;
    //             const image_url = ((state == 'poll' || state == 'lead_answer' && result_mode) && card_id) &&
    //                 localStorage.getItem(`card:${card_id}`) || undefined;
    //             return(
    //                 <PlayCardOnDeck 
    //                 lead_selected={result_mode && state == 'lead_answer' && roomConfig.metadata?.round_results && card_id == roomConfig.metadata.round_results.lead_card}
    //                 selected={card_id === myChoices[1] && !result_mode}
    //                 pollMode={state == 'poll' || result_mode}
    //                 answered={(!result_mode && user.user_id && actionUsersList.includes(user.user_id)) || (user.user_id == roomConfig.lead) || false}
    //                 key={user.user_id}
    //                 player_avatar={user.avatar}
    //                 image={image_url}
    //                 onClick={roomConfig.state == 'poll' && card_id ? () => onCardClick(card_id) : undefined}
    //                 />
    //             )
    //         })}
    //     </div>
    // }
}