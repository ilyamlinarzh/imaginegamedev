

export class WSRoomRequestManager {
    public ws: WebSocket

    constructor(ws: WebSocket) {
        this.ws = ws
    }

    setOnOpen(func: ()=>void) {
        this.ws.onopen = func;
    }

    ping() {
        this.ws.send(JSON.stringify({
            method: 'ping'
        }))
    }

    get_game_data() {
        this.ws.send(JSON.stringify({
            method: 'get_game_data'
        }))
    }

    tell_your_names() {
        this.ws.send(JSON.stringify({
            method: 'tell_your_names'
        }))
    }

    lead_answer(association: string, card_id: number){
        this.ws.send(JSON.stringify({
            method: "lead_answer",
            data: {
                association: association,
                card_id: card_id
            }
        }))
    }

    player_answer(card_id: number){
        this.ws.send(JSON.stringify({
            method: "player_answer",
            data: {
                card_id: card_id
            }
        }))
    }

    player_answer_poll(card_id: number){
        this.ws.send(JSON.stringify({
            method: "player_answer_poll",
            data: {
                card_id: card_id
            }
        }))
    }
}