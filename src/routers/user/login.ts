import Router from "koa-router";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid"; // 用于生成唯一会话ID
import { LoginRequest } from "../../global/response-types";
import { logError, logInfo } from "../../global";

export const loginRouters = new Router();

// 提取登录逻辑到独立函数
async function authenticateUser(username: string, password: string): Promise<boolean> 
{
    logInfo("Authenticating user");
    const users = JSON.parse(fs.readFileSync("./src/data/user_data.json", "utf8"));
    for (const user of users) 
    {
        if (user.username === username && user.password === password) 
        {
            return true;
        }
    }
    return false;
}

loginRouters.post("/register", async (ctx) => 
{
    try 
    {
        if (!ctx.session)
        {
            logInfo("Session not found");
            ctx.status = 500;
            ctx.body = 
            {
                message: "Internal server error"
            };
            return;
        }
        if (ctx.session.isLoggedIn == true)
        {
            logInfo("User already logged in");
            ctx.status = 200;
            ctx.body = 
            {
                message: "User already logged in"
            };
            return;
        }
        if (!ctx.request.body || typeof ctx.request.body !== "object") 
        {
            logInfo("Invalid request body");
            ctx.status = 400;
            ctx.body = 
            {
                message: "Invalid request body"
            };
            return;
        }
        const { username, password } = ctx.request.body as LoginRequest;
        if (!username || !password) 
        {
            logInfo("Missing username or password");
            ctx.status = 400;
            ctx.body = 
            {
                message: "Missing username or password"
            };
            return;
        }
        const users = JSON.parse(fs.readFileSync("./src/data/user_data.json", "utf8"));
        for (const user of users) 
        {
            if (user.username === username) 
            {
                logInfo("Username already exists");
                ctx.status = 200;
                ctx.body = 
                {
                    message: "Username already exists"
                };
                return;
            }
        }
        users.push({ 
            "username": username, "password": password 
        });
        fs.writeFileSync("./src/data/user_data.json", JSON.stringify(users, null, 2));
        logInfo("Register successful");

        ctx.session.isLoggedIn = true;
        ctx.session.username = username;

        logInfo("Login successful");
        ctx.status = 200;
        ctx.body = 
        {
            message: "Register successful and Login successful"
        };
    }
    catch (error: any) 
    {
        // 记录错误日志，避免暴露敏感信息
        logError(error);
        ctx.status = 500;
        ctx.body = 
        {
            message: "Internal server error"
        };
    }
});

loginRouters.post("/login", async (ctx) => 
{
    try 
    {
        if (!ctx.session)
        {
            logInfo("Session not found");
            ctx.status = 500;
            ctx.body = 
            {
                message: "Internal server error"
            };
            return;
        }
        if (ctx.session.isLoggedIn == true)
        {
            logInfo("User already logged in");
            ctx.status = 200;
            ctx.body = 
            {
                message: "User already logged in"
            };
            return;
        }
        // 验证请求体是否符合预期
        if (!ctx.request.body || typeof ctx.request.body !== "object") 
        {
            logInfo("Invalid request body");
            ctx.status = 400;
            ctx.body = 
            {
                message: "Invalid request body"
            };
            return;
        }

        const { username, password } = ctx.request.body as LoginRequest;

        // 验证用户名和密码是否提供
        if (!username || !password) 
        {
            logInfo("Missing username or password");
            ctx.status = 400;
            ctx.body = 
            {
                message: "Missing username or password"
            };
            return;
        }

        // 调用认证函数
        const isAuthenticated = await authenticateUser(username, password);

        if (isAuthenticated)
        {
            ctx.session.isLoggedIn = true;
            ctx.session.username = username;

            logInfo("Login successful");
            ctx.status = 200;
            ctx.body = 
            {
                message: "Login successful"
            };
        } 
        else 
        {
            logInfo("Login failed");
            ctx.status = 401;
            ctx.body = 
            {
                message: "Invalid username or password"
            };
        }
    } 
    catch (error: any) 
    {
        // 记录错误日志，避免暴露敏感信息
        logError(error);
        ctx.status = 500;
        ctx.body = 
        {
            message: "Internal server error"
        };
    }
});

loginRouters.post("/logout", async (ctx) => 
{
    try 
    {
        if (!ctx.session)
        {
            logInfo("Session not found");
            ctx.status = 500;
            ctx.body = 
            {
                message: "Internal server error"
            };
            return;
        }
        if (ctx.session.isLoggedIn == false || !ctx.session.isLoggedIn)
        {
            logInfo("User hasn't logged in");
            ctx.status = 200;
            ctx.body = 
            {
                message: "User hasn't logged in"
            };
            return;
        }
        ctx.session.isLoggedIn = false;
        ctx.session.username = "";
        logInfo("Logout successful");
        ctx.status = 200;
        ctx.body = 
        {
            message: "Logout successful"
        };
    }
    catch (error: any) 
    {
        // 记录错误日志，避免暴露敏感信息
        logError(error);
        ctx.status = 500;
        ctx.body = 
        {
            message: "Internal server error"
        };
    }
});