import { authCallbackApi, authLoginApi, authLogoutApi } from "./api/authApi";
import { getMeApi, patchMeApi } from "./api/meApi";
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

app.get("*", ...server);

export { app };
