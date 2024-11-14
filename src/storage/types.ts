import { User } from "../api";

interface MetaDataValues {
    round_results?: {poll: {[key: string]: number}; lead_card: number};
    players_cards?: number[];
    game_results?: {[key: string]: number};
}


export interface RoomConfig {
    state: string;
    lead: string;
    room_mode: string;
    deck_mode: 'default' | 'small';
    players: Partial<User<'other'>>[];
    all_players: Partial<User<'other'>>[];
    sequence: string[];
    players_max: 3 | 4 | 5 | 6 | 7;
    metadata?: MetaDataValues;
}

export interface RoomRating {
    [key: string]: number;
}