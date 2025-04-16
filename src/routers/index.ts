import Router from "koa-router";
import { userRouters } from "./user";

export const router = new Router({prefix: "/api"});

router.use(userRouters.routes()).use(userRouters.allowedMethods());

router.get("/", async (ctx) => {
    ctx.status = 200;
    ctx.body = 
    {
        message: "You successfully connected to the API!"
    };
});