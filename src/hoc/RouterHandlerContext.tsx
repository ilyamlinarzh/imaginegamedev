import bridge from "@vkontakte/vk-bridge";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { ScreenSpinner } from "@vkontakte/vkui";
import { createContext, ReactNode, useEffect, useState } from "react";
import { defaultHeight } from "../consts";

export interface ContextValues {
    showScreenSpinner: () => () => void;
    popout: ReactNode | null;
    setPopout: React.Dispatch<React.SetStateAction<ReactNode>>;
    realHeight: number;
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
    const [realHeight, setRealHeight] = useState<number>(defaultHeight);

    const navigator = useRouteNavigator()

    const showScreenSpinner = (): () => void => {
        const unblock = navigator.block(()=>true)
        setPopout(<ScreenSpinner size='large' />)
        return ()=>{
            setPopout(null)
            unblock()
        }
    }

    useEffect(()=>{
        bridge.subscribe((e) => {
            if (e.detail.type === 'VKWebAppBannerAdUpdated') {
              if(e.detail.data.result){
                console.log('SHOW BANNER AD')
                setRealHeight(defaultHeight-e.detail.data.banner_height)
              }else{
                console.log('HIDE BANNER AD')
                setRealHeight(defaultHeight)
              }
            }
          });
    }, [])

    const call = {showScreenSpinner, setPopout}
    const values = {popout, realHeight}

    return(
        <RouterHandlerContext.Provider value = {{...call, ...values}}>
            {children}
        </RouterHandlerContext.Provider>
    )
}