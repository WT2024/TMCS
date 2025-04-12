// 定义 IP 参数的类型
function log(level: string, message: string): void 
{
    let timestamp: string;

    try 
    {
        // 获取当前时间戳
        timestamp = new Date().toISOString();
    } 
    catch (error) 
    {
        // 如果时间戳生成失败，使用默认值
        timestamp = "UNKNOWN_TIMESTAMP";
    }

    // 输出日志信息
    console.log(`[${level.toUpperCase()}][${timestamp}] ${message}`);
}

// 信息日志函数
export function logInfo(message: string): void 
{
    log("info", message);
}

// 错误日志函数
export function logError(message: string): void 
{
    log("error", message);
}