import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import { logInfo, logError } from './global';
import { router } from './routers';

// 配置 Koa 会话中间件
const SESSION_CONFIG = {
    key: "koa:sess", // 会话 cookie 的键名
    maxAge: 86400000, // 会话过期时间 (1天)
    overwrite: true,
    httpOnly: true,
    signed: false,
    rolling: true
};

const app = new Koa();

app.use(async (ctx, next) => 
{
    logInfo(`${ctx.ip} ${ctx.method} ${ctx.url}`);
    await next();
});

// 使用会话中间件
app.use(session(SESSION_CONFIG, app));

// 使用 body-parser 中间件
app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
app.listen(3000, () => {
    console.log('server is running at http://localhost:3000');
});