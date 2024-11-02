import { actions_handler } from "./actions"
import { clearConfig } from "./storageMethods"
import { SocketResponse } from "./types"


export function onOpenWs (event: Event){
    console.log(event)
}

export function onMessageWs (event: MessageEvent){
    const data: SocketResponse = JSON.parse(event.data)
    actions_handler.executeMethod(data.action, data.data)
}

export function onCloseWs (event: CloseEvent){
    clearConfig()
}

export function onErrorWs (event: Event){
    console.log(event)
    window.history.back()
}