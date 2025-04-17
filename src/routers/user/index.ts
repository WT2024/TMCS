import Router from "koa-router";
import { loginRouters } from "./login";

export const userRouters = new Router({ prefix: "/user" });

userRouters.use(loginRouters.routes()).use(loginRouters.allowedMethods());

userRouters.get("/", async (ctx) => {
    ctx.status = 200;
    ctx.body = 
    {
        message: "You successfully connected to the user API!"
    };
});