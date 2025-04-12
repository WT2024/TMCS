import Router from "koa-router";
import { loginRouter } from "./login";

export const router = new Router({prefix: "/api"});
router.use(loginRouter.routes()).use(loginRouter.allowedMethods());

router.get("/", async (ctx) => {
    ctx.status = 200;
    ctx.body = 
    {
        message: "You successfully connected to the API!"
    };
});