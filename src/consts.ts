import { RequestNewRoom } from "./api";

export const defaultHeight = document.documentElement.clientHeight;
export const defaultWidth = document.documentElement.clientWidth;

export const RoomRefreshInterval = 5000;

export const currentDate = new Date()

export const monthsShortAlias = [
    'янв.',
    'фев.',
    'мар.',
    'апр.',
    'мая',
    'июн.',
    'июл.',
    'авг.',
    'сен.',
    'окт.',
    'ноя.',
    'дек.'
]

export const players_count_values: {[key: string]: RequestNewRoom['players_count']} = {
    "players-3":3,
    "players-4":4,
    "players-5":5,
    "players-6":6,
    "players-7":7
}

export const game_times = {
    prepare: 5,
    lead_answer: 43,
    players_answers: 18
}

export const GAMES_CONFIGS: {[key: number]: {default: any, small: any}} = {
        3: {
            "default": {
                "a": 2,
                "N": 60,
                "t": 8
            },
            "small": {
                "a": 2,
                "N": 45,
                "t": 6
            }
        },
        4: {
            "default": {
                "a": 1,
                "N": 60,
                "t": 9
            },
            "small": {
                "a": 1,
                "N": 40,
                "t": 5
            }
        },
        5: {
            "default": {
                "a": 0,
                "N": 50,
                "t": 7
            },
            "small": {
                "a": 0,
                "N": 50,
                "t": 7
            }
        },
        6: {
            "default": {
                "a": 0,
                "N": 72,
                "t": 9
            },
            "small": {
                "a": 0,
                "N": 72,
                "t": 9
            }
        },
        7: {
            "default": {
                "a": 0,
                "N": 98,
                "t": 10
            },
            "small": {
                "a": 0,
                "N": 98,
                "t": 10
            }
        }
    }