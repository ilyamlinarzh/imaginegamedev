import { game_times } from "../../consts";
import { loadImage } from "../../helpers";
import { RoomConfig, RoomRating } from "../../storage/types";
import { User } from "../types";
import { ActionsHandler } from "./actionsHandler";
import { clearActionUsersList, getMe, pushMyCards, pushPlayer, pushToActionUsersList, removeFromMyCards, removePlayer, setCurrentAssociation, setRating, updateFirstChoice, updateLead, updateMe,
     updateMetadata,
     updateOrPushPlayer, updatePlayer, updateRoomConfig, updateRoomState, 
     updateSecondChoice} from "./storageMethods";
import { GameDataAction, UpdateStateAction } from "./types";


export const actions_handler = new ActionsHandler()

function ping(data: any) {
    console.log(data)
}

function get_game_data_action(data: GameDataAction) {
    const updatedConfig: RoomConfig = {
        state: data.state,
        room_mode: data.config.room_mode,
        deck_mode: data.config.deck_mode,
        players_max: data.config.players_count,
        lead: data.lead!,
        players: data.players
    }
    updateRoomConfig(updatedConfig)
}

function tell_your_names_action(data: User<'other'>) {
    updateOrPushPlayer(data)
}

function player_connection_action(data: User<'other'>) {
    const me = getMe()

    if (data.user_id != me?.user_id){
        pushPlayer(data)
    }
}

function player_disconnection_action(data: {user_id: string}) {
    removePlayer(data.user_id)
}



function change_state_action(data: UpdateStateAction) {
    switch (data.state) {
        case 'lead_answer':
            updateLead(data.lead!)
            updateMetadata(data.results, "round_results")
            setCurrentAssociation('')
            break;
        case 'players_answers':
            clearActionUsersList()
            updateMetadata(undefined, "players_cards")
            updateRoomState(data.state)
            setCurrentAssociation(data.association!)
            break;
        case 'poll':
            updateRoomState(data.state)
            updateMetadata(data.card_ids, "players_cards")
            break;
        case 'end':
            updateRoomState(data.state)
            updateMetadata(data.results, "game_results")
            break;
        default:
            updateRoomState(data.state)
            break;
    }
}


function cards_images_packet_action(data: [number, string][]) {
    data.forEach(([card_id, image])=>{
        loadImage(image)
        localStorage.setItem(`card:${card_id}`, image)
    })
}


function rating_update_action(data: {rating: RoomRating}) {
    setRating(data.rating)
}


function new_cards_action(data: {card_ids: number[]}) {
    pushMyCards(data.card_ids)
}

function autoremove_card_action(data: {card_id: number}) {
    removeFromMyCards(data.card_id)
}


function player_answer_action(data: {result: boolean, card_id?: number}) {
    if (data.result){
        updateFirstChoice(data.card_id!)
        removeFromMyCards(data.card_id!)
    }
}

function player_answer_poll_action(data: {result: boolean, card_id?: number}) {
    if (!data.result){
        updateSecondChoice(0)
    }
}

function answer_event_action(data: {user_id: string}) {
    pushToActionUsersList(data.user_id)
}

function get_sequence_action(data: {sequence: string[]}) {
    ;
}

actions_handler.addMethods(
    [
        ['get_game_data', get_game_data_action],
        ['tell_your_names', tell_your_names_action],
        ['ping', ping],
        ['player_connection', player_connection_action],
        ['player_disconnection', player_disconnection_action],
        ['change_state', change_state_action],
        ['cards_images_packet', cards_images_packet_action],
        ['rating_update', rating_update_action],
        ['new_cards', new_cards_action],
        ['autoremove_card', autoremove_card_action],
        ['player_answer_poll', player_answer_poll_action],
        ['player_answer', player_answer_action],
        ['lead_answer', player_answer_action],
        ['answer_event', answer_event_action]
    ]
)