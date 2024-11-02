import { getDefaultStore } from "jotai"
import { roomConfigAtom, roomCurrentAssociationAtom, roomMyCardsAtom, roomMyChoicesAtom, roomRatingAtom, roomUsersActionListAtom, userAtom } from "../../storage"
import { User } from "../types"
import { RoomConfig, RoomRating } from "../../storage/types"


const store = getDefaultStore()

export const getMe = () => {
    const me = store.get(userAtom)
    return me;
}


export const pushPlayer = (player: Partial<User<'other'>>) => {
    store.set(roomConfigAtom, (current)=>{
        if (!current) return current;

        return {
            ...current,
            players: [...current.players, player]
        }
    })
}

export const updatePlayer = (player: Partial<User<'other'>>): boolean => {
    var updated = false;
    store.set(roomConfigAtom, (current)=>{
        if (!current) return current;

        return {
            ...current,
            players: current.players.map(p=>{
                if(p.user_id != player.user_id) return p;

                updated = true;
                return player;
            })
        }
    })

    return updated
}

export const updateOrPushPlayer = (player: Partial<User<'other'>>) => {
    const result = updatePlayer(player)
    if (!result) { pushPlayer(player); }
}

export const updateMe = () => {
    const me = getMe()
    if (!me) return;

    updateOrPushPlayer(me)
}

export const removePlayer = (player_id: string) => {
    store.set(roomConfigAtom, (current)=>{
        if (!current) return current;

        const updatedPlayers = current.players.filter(user=>user.user_id != player_id)
        return {
            ...current,
            players: updatedPlayers
        }
    })
}

export const updateRoomConfig = (updatedConfig: RoomConfig) => {
    store.set(roomConfigAtom, updatedConfig)
}

export const updateLead = (player_id: string) => {
    store.set(roomConfigAtom, (current)=>{
        if (!current) return current;

        return {
            ...current,
            state: 'lead_answer',
            lead: player_id
        }
    })
}

export const updateRoomState = (state: string) => {
    store.set(roomConfigAtom, (current)=>{
        if (!current) return current;
        
        return {...current, state: state}
    })
}

export const updateMetadata = (metadata: any, key: string) => {
    store.set(roomConfigAtom, (current)=>{
        if (!current) return current;

        return {...current, metadata: {...current.metadata, [key]: metadata}}
    })
}

export const setRating = (rating: RoomRating) => {
    store.set(roomRatingAtom, rating)
}

export const pushMyCards = (card_ids: number[]) => {
    store.set(roomMyCardsAtom, (current)=>{
        return [...current, ...card_ids]
    })
}

export const removeFromMyCards = (card_id: number) => {
    store.set(roomMyCardsAtom, (current)=>{
        return current.filter(cid=>cid!=card_id)
    })
}


export const setMyCards = (card_ids: number[]) => {
    store.set(roomMyCardsAtom, card_ids)
}


export const updateFirstChoice = (value: number) => {
    store.set(roomMyChoicesAtom, (current)=>{
        return [value, current[1]]
    })
}

export const updateSecondChoice = (value: number) => {
    store.set(roomMyChoicesAtom, (current)=>{
        return [current[0], value]
    })
}

export const clearChoices = () => {
    store.set(roomMyChoicesAtom, [0, 0])
}

export const pushToActionUsersList = (user_id: string) => {
    store.set(roomUsersActionListAtom, (current)=>[...current, user_id])
}

export const clearActionUsersList = () => {
    store.set(roomUsersActionListAtom, [])
}

export const setCurrentAssociation = (value: string) => {
    store.set(roomCurrentAssociationAtom, value)
}


export const clearConfig = () => {
    store.set(roomConfigAtom, null)
    store.set(roomRatingAtom, {})
    store.set(roomMyCardsAtom, [])
    store.set(roomMyChoicesAtom, [0, 0])
    store.set(roomUsersActionListAtom, [])
    store.set(roomCurrentAssociationAtom, '')
}