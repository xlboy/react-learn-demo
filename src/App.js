import { Button, Tabs } from 'antd';
import React, { useState } from 'react';
import FillLetter from './components/FillLetter'
import PushSquare from './components/PushSquare'

const allComponent = [
  {
    name: '宫格拼图游戏',
    Component: FillLetter
  },
  {
    name: '单词分割填空',
    Component: PushSquare
  }
]
const App = () => {
  const [componentIndex, setComponentIndex] = useState(0)
  return (
    <>
      <Tabs >
        {
          allComponent.map(e => (
            <Tabs.TabPane tab={e.name} key={e.name} >
              <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
                <e.Component />
              </div>
            </Tabs.TabPane >
          ))
        }
      </Tabs>
    </>
  )
};

export default App;