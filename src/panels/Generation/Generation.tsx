import { useMetaParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { Group, NavIdProps, Panel, PanelHeader, PanelHeaderBack, Placeholder, Snackbar } from "@vkontakte/vkui";
import { FC, useEffect, useState } from "react";
import { GenBackground } from "./GenBackground";
import './Generation.css'
import { PlayCard } from "../../components/Card/Card";
import { EmptyCard } from "../../components/Card/EmptyCard";
import { loadImage } from "../../helpers";
import { api, Card } from "../../api";
import { useAtom, useSetAtom } from "jotai";
import { snackbarAtom, userAtom, userCardsAtom } from "../../storage";


type ModeType = 'view' | 'generate'


export const Generation: FC<NavIdProps> = ({id}) => {

    const navigate = useRouteNavigator()

    const [me, setMe] = useAtom(userAtom)
    const setMyCards = useSetAtom(userCardsAtom)
    const params = useMetaParams<{mode: ModeType; prompt?: string; image?: string; card_id?: number}>()
    const [image, setImage] = useState<string | null>(null)
    const [process, setProcess] = useState(false)

    const setSnack = useSetAtom(snackbarAtom)

    async function showCard(url: string, timeout: number = 0) {
        return new Promise(async (resolve, reject)=>{
            await loadImage(url)
            setTimeout(() => {
                setImage(url)
                resolve(undefined)
            }, timeout);
        })
    }

    async function createTask() {
        await api.generations_create_task(params?.prompt!)
    }

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function wait_task(): Promise<Card<'me'> | null> {
        return new Promise(async (resolve, reject)=>{
            var result: Card<'me'> | null = null
            let stop = false
            while (!result && !stop) {
                await delay(5000)
                const response = await api.generations_my().catch((err)=>{
                    reject()
                    
                    stop = true
                })
                if(response?.data?.card){
                    result = response.data?.card
                }
            }
            if(result){
                setMe((current)=>{
                    if (!current) return current;

                    return {...current, generations: current.generations - 5}
                })
            }
            resolve(result);
        })
    }

    const closeWithSnackbar = (unblock?: ()=>void) => {
        unblock && unblock()
        navigate.back()
        setSnack(
            <Snackbar
            onClose={()=>setSnack(null)}
            placement='bottom'
            offsetY={50}
            >
                Не удалось сгенерировать карту
            </Snackbar>
        )
    }

    useEffect(()=>{
        async function fetchData() {
            
            const unblock = navigate.block(()=>true)
            if (params?.mode == 'view'){
                setProcess(true)
                await showCard(params.image!, 3000).catch((err)=>{
                    closeWithSnackbar(unblock)
                })
                setProcess(false)
            }else{
                await createTask().catch((err)=>{
                    console.log(err)
                    closeWithSnackbar(unblock)
                })
                const card = await wait_task().catch((err)=>{
                    closeWithSnackbar(unblock)
                })
                if (card){
                    await showCard(card?.image!, 0)
                    setMyCards((current)=>[card, ...current])
                }
            }
            unblock()
        }
        
        fetchData()
    }, [])

    return(
        <Panel
        id={id}
        >
            <PanelHeader 
            delimiter='none'
            before={!(process || !image) && <PanelHeaderBack onClick={()=>navigate.back()} />}
            >
                Генерация
            </PanelHeader>
            <Group
            mode='card'
            separator='hide'
            //@ts-ignore
            padding='none'
            >
                <Group
                mode='card'
                className='card-group__background'
                // style={{backgroundImage: !process && image ? `url(${image})` : 'none'}}
                separator="hide"
                >
                    <GenBackground />
                    <div className="card-group__cardcase">
                        {process || !image ?
                            <EmptyCard />
                        :
                            <PlayCard 
                            image={image} 
                            style={{animation:'cover-in 500ms ease-out forwards'}}
                            />
                        }
                    </div>
                    <div style={{backgroundImage: !process && image ? `url(${image})` : 'none', animation: !process && image ? 'cover-out 500ms ease-out forwards' : 'none'}} className='card-group__blur-cover'/>
                    <div className='card-group__blur-cover'/>
                </Group>

                
                {process || !image ?
                    <Placeholder
                    header='Создаём карту...'
                    >
                        Это займёт несколько секунд...
                    </Placeholder>
                :
                    <Placeholder
                    header='Готово'
                    >
                        Карта уже в вашей колоде!
                    </Placeholder>
                }
            </Group>
        </Panel>
    )
}