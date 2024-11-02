import { useEffect, useRef, useState } from "react"
import { joinRoomSocket } from "../api/ws"
import { WSRoomRequestManager } from "../api/ws/requestManager"


export const useRoomWebSocket = (room_id: string) => {
    const [wsManagerState, setWsManagerState] = useState<WSRoomRequestManager | null>(null)

    useEffect(()=>{
        const ws = joinRoomSocket(room_id);
        const manager = new WSRoomRequestManager(ws);
        setWsManagerState(manager)

        return () => ws.close();
    }, [])


    return wsManagerState
}