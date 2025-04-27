import React, { useState } from 'react';
import ColorGenerator from './components/ColorGenerator';
import TaskProcessor from './components/TaskProcessor';
import './css/styles.css';

const TABS = {
  COLOR_GENERATOR: 'colorGenerator',
  TASK_PROCESSOR: 'taskProcessor',
};

function App() {

  const [activeTab, setActiveTab] = useState(TABS.COLOR_GENERATOR);

  return (
    <div className="App">


      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          onClick={() => setActiveTab(TABS.COLOR_GENERATOR)}
          className={activeTab === TABS.COLOR_GENERATOR ? 'active' : ''}
        >
          颜色矩阵生成器
        </button>
        <button
          onClick={() => setActiveTab(TABS.TASK_PROCESSOR)}
          className={activeTab === TABS.TASK_PROCESSOR ? 'active' : ''}
        >
          异步任务处理器
        </button>
      </div>


      <div className="tab-content">
        {activeTab === TABS.COLOR_GENERATOR && (
          <ColorGenerator />
        )}

        {activeTab === TABS.TASK_PROCESSOR && (
          <TaskProcessor />
        )}
      </div>

    </div>
  );
}

export default App; 