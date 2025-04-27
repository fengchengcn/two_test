import React, { useState, useCallback, useRef } from 'react';
import '../css/TaskProcessor.css';
import { loadConfig, loadFile, initSystem } from '../utils/taskProcessorUtils';

const TaskProcessor = () => {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('Idle'); // 状态： Idle(空闲), Processing(处理中), Completed(已完成), Failed(失败)
  const [progress, setProgress] = useState(0); // 进度: 0-100%
  const [isProcessing, setIsProcessing] = useState(false);
  const logCounter = useRef(0);

  const addLog = useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prevLogs => [...prevLogs, { id: logCounter.current++, time: timestamp, msg: message }]);
  }, []);

  const runTaskWithTimeout = (taskFn, timeoutMs) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Operation timed out'));
      }, timeoutMs);

      taskFn()
        .then(resolve)
        .catch(reject)
        .finally(() => clearTimeout(timer));
    });
  };

  const loadFileWithRetry = async (file, maxRetries = 3, initialDelay = 500, timeout = 5000) => {
    let attempts = 0;
    let currentDelay = initialDelay;

    while (attempts <= maxRetries) {
      try {
        addLog(`Attempt ${attempts + 1} to load ${file}...`);
        const result = await runTaskWithTimeout(() => loadFile(file), timeout);
        addLog(`Success: ${result}`);
        return true; 
      } catch (error) {
        attempts++;
        addLog(`Error loading ${file} (Attempt ${attempts}): ${error.message}`);
        if (attempts > maxRetries) {
          addLog(`Failed to load ${file} after ${maxRetries + 1} attempts.`);
          throw new Error(`Failed to load ${file} definitively: ${error.message}`);
        }
        addLog(`Retrying ${file} in ${currentDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, currentDelay));
        currentDelay *= 2;
      }
    }
    return false; 
  };


  const onStartBtnClick = useCallback(async () => {
    setIsProcessing(true);
    setStatus('Processing');
    setLogs([]);
    setProgress(0);
    logCounter.current = 0;
    addLog("Starting task processing...");

    let fileList = [];
    let filesLoadedCount = 0;
    const MAX_CONCURRENCY = 3;

    try {
      // 1. Load Config
      setStatus('Loading Config...');
      addLog("Loading configuration...");
      fileList = await loadConfig();
      addLog(`Configuration loaded. Found ${fileList.length} files.`);

      // 2. Load Files
      setStatus(`Loading Files (0/${fileList.length})...`);
      setProgress(0);

      const queue = [...fileList];
      const activeLoads = new Set();
      let processingComplete = false;

      await new Promise((resolve, reject) => {
        const checkCompletion = () => {
          if (filesLoadedCount === fileList.length && activeLoads.size === 0) {
            processingComplete = true;
            resolve();
          }
        };

        const startNextLoad = () => {
          if (processingComplete || queue.length === 0 || activeLoads.size >= MAX_CONCURRENCY) {
            return;
          }

          const fileToLoad = queue.shift();
          const loadPromise = loadFileWithRetry(fileToLoad)
            .then(() => {
              filesLoadedCount++;
              const currentProgress = Math.round((filesLoadedCount / fileList.length) * 100);
              setProgress(currentProgress);
              setStatus(`Loading Files (${filesLoadedCount}/${fileList.length})...`);
            })
            .catch(error => {
              addLog(`FATAL: ${error.message}`);
              processingComplete = true;
              reject(error);
            })
            .finally(() => {
              activeLoads.delete(loadPromise);
              if (!processingComplete) {
                startNextLoad();
                checkCompletion();
              }
            });

          activeLoads.add(loadPromise);
          startNextLoad();
        };

        for (let i = 0; i < MAX_CONCURRENCY && i < fileList.length; i++) {
          startNextLoad();
        }

        checkCompletion(); // Initial check
      });


      addLog("All files loaded successfully.");

      // 3. Init System
      setStatus('Initializing System...');
      addLog("Initializing system...");
      await initSystem();
      addLog("System initialized successfully.");

      setStatus('Completed');
      addLog("Task processing finished successfully.");

    } catch (error) {
      setStatus('Failed');
      addLog(`Error during processing: ${error.message}`);
      console.error("Task Processing Error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [addLog]);


  return (
    <div className="task-processor">
      <h2>异步任务处理器</h2>
      <div className="controls">
        <button onClick={onStartBtnClick} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : '开始处理'}
        </button>
        <div className="status-progress">
          <span className="status">状态: {status}</span>
          {isProcessing && status.startsWith('Loading Files') && (
            <span className="progress">进度: {progress}%</span>
          )}
        </div>
      </div>
      <div className="console">
        <h3>Console Output:</h3>
        <div className="log-area">
          {logs.length === 0 && <p>点击 "开始处理" 以查看日志。</p>}
          {logs.map(log => (
            <p key={log.id} className="log-entry">
              <span className="log-time">{log.time}</span>
              <span className="log-msg">{log.msg}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskProcessor; 