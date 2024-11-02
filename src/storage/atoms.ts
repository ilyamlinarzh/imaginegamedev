import { atom } from "jotai";
import { Card, RoomPreview, User } from "../api";
import { RoomConfig, RoomRating } from "./types";
import { ReactNode } from "react";

// export const activeStory = atom<string>('main_view')
// export const activePanel = atom<string>('main')

export const snackbarAtom = atom<ReactNode | null>(null)


export const userAtom = atom<User<'me'> | null>(null);
export const userCardsAtom = atom<Card<'me'>[]>([]);
export const defaultCardsAtom = atom<Card<'other'>[]>([])

export const promptAtom = atom<string | null>('');


export const userCardsRemoveAtom = atom(
    null,
    (get, set, card_id: number) => {
        const current = get(userCardsAtom)
        const newList = current.filter(card=>card.card_id != card_id)
        set(userCardsAtom, newList)
    }
)

export const userCardsUpdateAtom = atom(
    null,
    (get, set, update_params: Partial<Card<"me">> & Pick<Card<"me">, "card_id"> ) => {
        const current = get(userCardsAtom)
        const updateList = current.map(card=>{
            if (card.card_id != update_params.card_id) {
                return card;
            }

            return {...card, ...update_params}
        })
    }
)



export const activeRoomsAtom = atom<RoomPreview[]>([]);


export const fullRatingAtom = atom<User<'rating'>[] | null>(null);
export const userRatingPlaceAtom = atom<number | null>(null);


export const roomConfigAtom = atom<RoomConfig | null>(null)
export const roomRatingAtom = atom<RoomRating>({})
export const roomMyCardsAtom = atom<number[]>([])
export const roomMyChoicesAtom = atom<[number, number]>([0, 0])
export const roomUsersActionListAtom = atom<string[]>([])
export const roomCurrentAssociationAtom = atom<string>('')