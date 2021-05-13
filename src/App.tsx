import { Spin } from 'antd'
import React, { Suspense } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import LeftNavs from './layouts/LeftNavs'

interface Page {
  name: string
  href: string
  Component: React.LazyExoticComponent<React.ComponentType<any>>
}
const pages: Page[] = [
  {
    name: '宫格拼图游戏',
    href: 'push-square',
    Component: React.lazy(() => import(/* webpackChunkName:"PushSquare" */ '@/pages/PushSquare')),
  },
  {
    name: '单词分割填空',
    href: 'fill-letter',
    Component: React.lazy(() => import(/* webpackChunkName:"FillLetter" */ '@/pages/FillLetter')),
  },
]

const App = () => {
  return (
    <>
      <LeftNavs navs={pages} />
      <div className='layout-main'>
        <HashRouter>
          <Suspense fallback={<Spin />}>
            <Switch>
              {pages.map(e => (
                <Route key={e.name} path={`/${e.href}`} component={e.Component} />
              ))}
            </Switch>
          </Suspense>
        </HashRouter>
      </div>
    </>
  )
}

export default App
