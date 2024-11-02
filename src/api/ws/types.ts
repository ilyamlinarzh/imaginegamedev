
export interface GameDataAction {
    rating: {[key: string]: number};
    config: {room_mode: string; deck_mode: 'default' | 'small'; players_count: 3 | 4 | 5 | 6 | 7};
    state: string;
    lead?: string;
    players: {user_id: string}[];
}

export interface SocketResponse<T = any> {
    action: string;
    data: T;
}


export interface PollDataActionResponse {
    card_ids: number[]
}


export interface UpdateStateAction {
    state: 'lobby' | 'prepare' | 'lead_answer' | 'players_answers' | 'poll' | 'end';
    lead?: string;
    results?: {[key: string]: number};
    card_ids?: number[];
    association?: string;
}