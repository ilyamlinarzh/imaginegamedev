import { useContext } from "react"
import { RouterHandlerContext, ContextValues } from "../hoc/RouterHandlerContext"


export const useCustomRouteMethods = (): ContextValues => {
    const context = useContext(RouterHandlerContext);
    if (!context){
        throw new Error('Context is empty')
    }
    
    return context
}