import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { ScreenSpinner } from "@vkontakte/vkui";
import { createContext, ReactNode, useState } from "react";

export interface ContextValues {
    showScreenSpinner: () => () => void;
    popout: ReactNode | null;
    setPopout: React.Dispatch<React.SetStateAction<ReactNode>>;
}

export const RouterHandlerContext = createContext<ContextValues | undefined>(undefined);

interface ProviderProps {
    children: ReactNode;
}

export const RouterHandlerProvider = ({
    children
}: ProviderProps): ReactNode => {

    const [popout, setPopout] = useState<ReactNode | null>(null)
    const [isBlocked, setIsBlocked] = useState(false);

    const navigator = useRouteNavigator()

    const showScreenSpinner = (): () => void => {
        const unblock = navigator.block(()=>true)
        setPopout(<ScreenSpinner size='large' />)
        return ()=>{
            setPopout(null)
            unblock()
        }
    }

    const call = {showScreenSpinner, setPopout}
    const values = {popout}

    return(
        <RouterHandlerContext.Provider value = {{...call, ...values}}>
            {children}
        </RouterHandlerContext.Provider>
    )
}