import {
  createHashParamRouter,
  createHashRouter,
  createModal,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';

// VIEWS
export const MAIN_VIEW = 'main_view';
export const MARKET_VIEW = 'market_view';
export const CARDS_VIEW = 'cards_view';
export const RATING_VIEW = 'rating_view';

export const DEFAULT_VIEW = MAIN_VIEW;
// VIEWS

export const MAIN_VIEW_PANELS = {
  MAIN: 'main',
  GAME: 'game'
} as const;

export const MARKET_VIEW_PANELS = {
  MARKET: 'market'
} as const;

export const CARDS_VIEW_PANELS = {
  CARDS: 'cards',
  CARDSLIST: 'cardslist',
  DEFAULTCARDS: 'defaultcardslist',
  CARD: 'card',
  GENERATE: 'generate'
} as const;

export const RATING_VIEW_PANELS = {
  RATING: 'rating'
} as const;

export const DEFAULT_VIEW_PANELS = MAIN_VIEW_PANELS;

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(MAIN_VIEW, [
      createPanel(MAIN_VIEW_PANELS.MAIN, '/', [
        createModal('ratinginfo', '/about_rating'),
        createModal('createroom', '/create_room'),
        createModal('inputroom', '/input_room')
      ]),
      createPanel(MAIN_VIEW_PANELS.GAME, `/${MAIN_VIEW_PANELS.GAME}/:room_id`, [
        createModal('shareroom', `/${MAIN_VIEW_PANELS.GAME}/:room_id/share`)
      ])
    ]),

    createView(MARKET_VIEW, [
      createPanel(MARKET_VIEW_PANELS.MARKET, `/${MARKET_VIEW_PANELS.MARKET}`, [
        createModal('premiuminfo', `/${MARKET_VIEW_PANELS.MARKET}/about_premium`),
        createModal('confirmbuy', `/${MARKET_VIEW_PANELS.MARKET}/buy/:item`)
      ])
    ]),

    createView(CARDS_VIEW, [
      createPanel(CARDS_VIEW_PANELS.CARDS, `/${CARDS_VIEW_PANELS.CARDS}`, [
        createModal('createcard', `/${CARDS_VIEW_PANELS.CARDS}/prompt`)
      ]),
      createPanel(CARDS_VIEW_PANELS.GENERATE, `/${CARDS_VIEW_PANELS.CARDS}/${CARDS_VIEW_PANELS.GENERATE}`, []),
      createPanel(CARDS_VIEW_PANELS.CARDSLIST, `/${CARDS_VIEW_PANELS.CARDS}/:user_id`, []),
      createPanel(CARDS_VIEW_PANELS.DEFAULTCARDS, `/${CARDS_VIEW_PANELS.CARDS}/defaults`, []),
      createPanel(CARDS_VIEW_PANELS.CARD, `/${CARDS_VIEW_PANELS.CARD}`, [
        createModal('deletecard', `/${CARDS_VIEW_PANELS.CARD}/delete`)
      ])
    ]),

    createView(RATING_VIEW, [
      createPanel(RATING_VIEW_PANELS.RATING, `/${RATING_VIEW_PANELS.RATING}`, [])
    ])
  ]),
]);

export const panelsWithoutTabbar = [CARDS_VIEW_PANELS.CARDSLIST,
   CARDS_VIEW_PANELS.CARD, CARDS_VIEW_PANELS.GENERATE, MAIN_VIEW_PANELS.GAME, CARDS_VIEW_PANELS.DEFAULTCARDS] as string[]

export const router = createHashRouter(routes.getRoutes());
