import { Cell, Group, TabbarItem, Tabbar as TabbarVK, usePlatform } from "@vkontakte/vkui";
import { ReactNode } from "react";
import { CARDS_VIEW, MAIN_VIEW, MARKET_VIEW, panelsWithoutTabbar, RATING_VIEW, routes } from "../../routes";
import { useActiveVkuiLocation, useGetPanelForView, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { Icon28Cards2Outline, Icon28HomeOutline, Icon28StatisticsOutline, Icon28StorefrontOutline } from "@vkontakte/icons";
import { useCustomRouteMethods } from "../../hooks/useCustomRouteMethods";

const viewToPanel: {[key:string]: string} = {
    'main_view': '/',
    'market_view': '/market',
    'cards_view': '/cards',
    'rating_view': '/rating'
}

export const Tabbar = (): ReactNode => {

    const { view: activeView, panel: activePanel } = useActiveVkuiLocation()
    const navigate = useRouteNavigator()


    const onStoryChange = (e: any) => {
        const view = e.currentTarget.dataset.story
        navigate.push(viewToPanel[view])
    }

    return(
        <TabbarVK>
            <TabbarItem
            selected={activeView === MAIN_VIEW}
            data-story={MAIN_VIEW}
            text="Главная"
            onClick={onStoryChange}
            >
                <Icon28HomeOutline />
            </TabbarItem>
            <TabbarItem
            selected={activeView === MARKET_VIEW}
            data-story={MARKET_VIEW}
            text="Магазин"
            onClick={onStoryChange}
            >
                <Icon28StorefrontOutline />
            </TabbarItem>
            <TabbarItem
            selected={activeView === CARDS_VIEW}
            data-story={CARDS_VIEW}
            text="Карты"
            onClick={onStoryChange}
            >
                <Icon28Cards2Outline />
            </TabbarItem>
            <TabbarItem
            selected={activeView === RATING_VIEW}
            data-story={RATING_VIEW}
            text="Рейтинг"
            onClick={onStoryChange}
            >
                <Icon28StatisticsOutline />
            </TabbarItem>
        </TabbarVK>
    )
}

export const DesktopTabbar = (): ReactNode => {
    const { view: activeView, panel: activePanel } = useActiveVkuiLocation()
    const navigate = useRouteNavigator()

    const platform = usePlatform();

    const onStoryChange = (e: any) => {
        const view = e.currentTarget.dataset.story
        navigate.push(viewToPanel[view])
    }

    const activeStoryStyles = {
        backgroundColor: 'var(--vkui--color_background_secondary)',
        borderRadius: 8,
    };

    return(
        <Group
        mode='card'
        >
            <Cell
            disabled={activeView === MAIN_VIEW}
            style={activeView === MAIN_VIEW ? activeStoryStyles : undefined}
            data-story={MAIN_VIEW}
            onClick={onStoryChange}
            before={<Icon28HomeOutline />}
            >
                Главная
            </Cell>
            <Cell
            disabled={activeView === MARKET_VIEW}
            style={activeView === MARKET_VIEW ? activeStoryStyles : undefined}
            data-story={MARKET_VIEW}
            onClick={onStoryChange}
            before={<Icon28StorefrontOutline />}
            >
                Магазин
            </Cell>
            <Cell
            disabled={activeView === CARDS_VIEW}
            style={activeView === CARDS_VIEW ? activeStoryStyles : undefined}
            data-story={CARDS_VIEW}
            onClick={onStoryChange}
            before={<Icon28Cards2Outline />}
            >
                Карты
            </Cell>
            <Cell
            disabled={activeView === RATING_VIEW}
            style={activeView === RATING_VIEW ? activeStoryStyles : undefined}
            data-story={RATING_VIEW}
            onClick={onStoryChange}
            before={<Icon28StatisticsOutline />}
            >
                Рейтинг
            </Cell>
        </Group>
    )
}