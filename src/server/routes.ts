import { authCallbackApi, authLoginApi, authLogoutApi } from "./api/authApi";
import { getMeApi, patchMeApi } from "./api/meApi";
import { insertSeedApi } from "./api/seedApi";
import { getTarotCardsApi } from "./api/tarotCardApi";
import {
  createTarotDrawHistoryApi,
  dealCardsTarotDrawHistoryApi,
  fortuneTellingTarotDrawHistoryApi,
  getTarotDrawHistoriesApi,
  getTarotDrawHistoryApi,
  patchSpreadIdTarotDrawHistoryApi,
  shuffleDeckTarotDrawHistoryApi,
} from "./api/tarotDrawHistoryApi";
import {
  choiceSpreadApi,
  getTarotSpreadApi,
  getTarotSpreadsApi,
} from "./api/tarotSpreadApi";
import { middleware } from "./middleware";
import { server } from "./server";
import { createApp } from "./utils/createApp";

const app = createApp();

app.route("/", middleware);

app
  .get("/api/auth/login", ...authLoginApi)
  .get("/api/auth/callback", ...authCallbackApi)
  .get("/api/auth/logout", ...authLogoutApi);

const _meApi = app.get("/api/me", ...getMeApi).patch("/api/me", ...patchMeApi);
export type MeAPI = typeof _meApi;

const _tarotDrawHistoryApi = app
  .get("/api/tarot-draw-histories", ...getTarotDrawHistoriesApi)
  .get("/api/tarot-draw-histories/:id", ...getTarotDrawHistoryApi)
  .post("/api/tarot-draw-histories", ...createTarotDrawHistoryApi)
  .patch(
    "/api/tarot-draw-histories/:id/spread-id",
    ...patchSpreadIdTarotDrawHistoryApi,
  )
  .patch(
    "/api/tarot-draw-histories/:id/shuffle-deck",
    ...shuffleDeckTarotDrawHistoryApi,
  )
  .post(
    "/api/tarot-draw-histories/:id/deal-cards",
    ...dealCardsTarotDrawHistoryApi,
  )
  .get(
    "/api/tarot-draw-histories/:id/fortune-telling",
    ...fortuneTellingTarotDrawHistoryApi,
  );
export type TarotDrawHistoryApi = typeof _tarotDrawHistoryApi;

const _seedApi = app.get("/api/seed", ...insertSeedApi);
export type SeedApi = typeof _seedApi;

const _tarotSpreadsApi = app
  .get("/api/choice-tarot-spreads", ...choiceSpreadApi)
  .get("/api/tarot-spreads", ...getTarotSpreadsApi)
  .get("/api/tarot-spreads/:id", ...getTarotSpreadApi);
export type TarotSpreadsApi = typeof _tarotSpreadsApi;

const _tarotCardsApi = app.get("/api/tarot-cards", ...getTarotCardsApi);
export type TarotCardsApi = typeof _tarotCardsApi;

app.get("*", ...server);

export { app };
