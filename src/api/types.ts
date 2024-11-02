export type UserFieldsMode = 'me' | 'other' | 'rating';

type AdditionalUserFields<T extends UserFieldsMode> =
    T extends 'me'
        ? {balance: number; generations: number; rep: number}
        : T extends 'other'
            ? {rep: number;}
            : {};

type AdditionalCardFields<T extends UserFieldsMode> =
    T extends 'me'
        ? {visible: boolean; action_time: string; user_prompt: string;}
        : {};


export type User<T extends UserFieldsMode = 'other'> = {
    user_id: string;
    avatar: string;
    name: string;
    rating: number;
    premium: number;

    /**
    В режиме "me" так же содержится:
    balance: number;
    generations: number;
    rep: number;
    */
} & AdditionalUserFields<T>

export type Card<T extends UserFieldsMode = 'other'> = {
    card_id: number;
    type: "default" | "special" | "ai";
    keys?: string[];
    image: string;
    owner_id?: string;

    /**
    В режиме "me" так же содержится:
    visible: boolean;
    */
} & AdditionalCardFields<T>

export interface RoomPreview {
    room_id: string;
    players_count: number;
    players_max: number;
    players_avatars: string[];
    deck_mode: "default" | "small";
}


export interface MeResponse extends User<'me'> {
    cards: Card<'me'>[];
}

export interface RatingResponse {
    rating: User<'rating'>[];
    my_place: number;
}

export interface PickupCardResponse {
    card: Card<'me'> | null
}

export interface Response<T> {
    error: boolean;
    message?: string;
    data?: T;
}


export interface RequestNewRoom {
    players_count: 3 | 4 | 5 | 6 | 7;
    room_mode: "public" | "private";
    deck_mode: "default" | "small";
}