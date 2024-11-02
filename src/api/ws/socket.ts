import { server } from "../config"
import { onCloseWs, onErrorWs, onMessageWs, onOpenWs } from "./events"


export function joinRoomSocket (room_id: string): WebSocket {
    const sign_query = encodeURIComponent(window.location.search)

    const ws = new WebSocket(`wss://${server}/ws/${room_id}?sign=${sign_query}`)
    ws.onopen = onOpenWs;
    ws.onmessage = onMessageWs;
    ws.onclose = onCloseWs;
    ws.onerror = onErrorWs;

    return ws
}