/**
 * 加载配置 (模拟)。
 * @returns {Promise<string[]>} List of files.
 * 文件列表。
 */
export async function loadConfig() {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Configuration loaded.");
    return Array.from({ length: 20 }, (_, i) => `file_${i + 1}.data`);
}

/**
 * 加载文件 (模拟延迟和潜在失败)。
 * @param {string} file Filename.
 * 文件名。
 * @returns {Promise<string>} 
 * 文件的成功消息。
 */
export async function loadFile(file) {
    const loadTime = 1000 + Math.random() * 5000; // 1-6 seconds / 秒
    const shouldFail = Math.random() < 0.15; // 15% failure chance / 失败概率

    await new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error(`Failed to load ${file}`));
            } else {
                resolve(`Successfully loaded ${file}`);
            }
        }, loadTime);
    });
    return `Successfully loaded ${file}`;
}


/**
 * 初始化系统 (模拟)。
 * @returns {Promise<void>}
 */
export async function initSystem() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("System initialized.");
} 