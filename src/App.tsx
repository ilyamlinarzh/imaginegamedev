import { useState, useEffect, ReactNode } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { View, SplitLayout, SplitCol, ScreenSpinner, Epic, useAdaptivityConditionalRender, usePlatform, PanelHeader, Panel } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { DEFAULT_VIEW, DEFAULT_VIEW_PANELS, panelsWithoutTabbar } from './routes';
import { MainPanel } from './panels/Main/Main';

import { activeRoomsAtom, defaultCardsAtom, snackbarAtom, userAtom, userCardsAtom } from './storage';
import { api } from './api';
import { DesktopTabbar, Tabbar } from './components/Tabbar/Tabbar';
import { Rating } from './panels/Rating/Rating';
import { MyCards } from './panels/MyCards/MyCards';
import { useCustomRouteMethods } from './hooks/useCustomRouteMethods';
import { CardsList } from './panels/CardsList/CardsList';
import { CardShowCase } from './panels/CardShowCase/CardShowCase';
import { Modals } from './modals/Modals';
import { Generation } from './panels/Generation/Generation';
import { GameRoom } from './panels/GameRoom/GameRoom';
import { DefaultCardsList } from './panels/CardsList/DefaultCardsList';
import { Market } from './panels/Market/Market';
import bridge from '@vkontakte/vk-bridge';
import { onboarding_slides } from './images/onboarding';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.MAIN, view: activeView = DEFAULT_VIEW } = useActiveVkuiLocation();

  const setMe = useSetAtom(userAtom);
  const setMeCards = useSetAtom(userCardsAtom);
  const setActivesRooms = useSetAtom(activeRoomsAtom);
  const setDefaultCards = useSetAtom(defaultCardsAtom)


  const platform = usePlatform();
  const { viewWidth } = useAdaptivityConditionalRender();

  const {popout, showScreenSpinner} = useCustomRouteMethods()

  useEffect(() => {
    async function fetchData() {
      await bridge.send('VKWebAppStorageGet', {keys: ['onboarding_test2']})
      .then(async (data)=>{
        if (data.keys) {
          if (data.keys[0].value != '1') {
            //@ts-ignore
            await bridge.send('VKWebAppShowSlidesSheet', {slides:onboarding_slides})
            .then((data)=>{
              if (data.result) {
                bridge.send('VKWebAppStorageSet', {key: 'onboarding_test2', value: '1'})
              }
            })
            .catch((err)=>console.log(err))
          }
        }
      })
      .catch((err)=>console.log(err))

      const closeSpinner = showScreenSpinner()
      const user = await api.users_me()
      const {cards, ...userData} = user.data!
      setMe(userData)
      setMeCards(cards)

      const rooms = await api.rooms_actives();
      setActivesRooms(rooms.data!)

      const defaultCards = await api.cards_default(15, 0)
      if(defaultCards.data){
        setDefaultCards(defaultCards.data)
      }

      bridge.send('VKWebAppShowBannerAd')

      closeSpinner();
    }
    fetchData();
  }, []);
  
  const showNavigationBar = !panelsWithoutTabbar.includes(activePanel)
  const hasHeader = platform !== 'vkcom';

  const windowInnerWidth = window.innerWidth
  const windowInnerHeight = window.innerHeight

  const desktopMode = windowInnerWidth >= windowInnerHeight

  return (
    <SplitLayout 
    modal={<Modals />} 
    popout={popout}
    header={hasHeader && <PanelHeader delimiter="none" />}
    center
    >
      <SplitCol width="66%" autoSpaced>
        <Epic
        activeStory={activeView}
        tabbar={showNavigationBar && <Tabbar />}
        >
          <View id='main_view' activePanel={activePanel}>
            <MainPanel id="main" />
            <GameRoom id="game" />
          </View>
          <View id='cards_view' activePanel={activePanel}>
            <MyCards id='cards' />
            <CardsList id='cardslist' />
            <DefaultCardsList id='defaultcardslist' />
            <CardShowCase id='card' />
            <Generation id='generate' />
          </View>
          <View id='market_view' activePanel={activePanel}>
            <Market id='market' />
          </View>
          <View id='rating_view' activePanel={activePanel}>
            <Rating id='rating' />
          </View>
        </Epic>
      </SplitCol>
    </SplitLayout>
  );
};
