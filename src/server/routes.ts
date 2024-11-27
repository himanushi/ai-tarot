import { authCallbackApi, authLoginApi, authLogoutApi } from "./api/authApi";
import { getMeApi, patchMeApi } from "./api/meApi";
import { insertSeedApi } from "./api/seedApi";
import {
  createTarotDrawHistoryApi,
  dealCardsTarotDrawHistoryApi,
  getTarotDrawHistoryApi,
  patchSpreadIdTarotDrawHistoryApi,
  shuffleDeckTarotDrawHistoryApi,
} from "./api/tarotDrawHistoryApi";
import { choiceSpreadApi, getTarotSpreadsApi } from "./api/tarotSpreadApi";
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
  );
export type TarotDrawHistoryApi = typeof _tarotDrawHistoryApi;

const _seedApi = app.get("/api/seed", ...insertSeedApi);
export type SeedApi = typeof _seedApi;

const _tarotSpreadsApi = app
  .get("/api/choice-tarot-spreads", ...choiceSpreadApi)
  .get("/api/tarot-spreads", ...getTarotSpreadsApi);
export type TarotSpreadsApi = typeof _tarotSpreadsApi;

app.get("*", ...server);

export { app };
