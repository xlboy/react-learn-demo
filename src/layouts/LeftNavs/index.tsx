import { Button, Drawer, Menu } from 'antd'
import React, { FC, useState } from 'react'
import { MenuFoldOutlined } from '@ant-design/icons'
import './index.less'

interface LeftNavsProps {
  navs: {
    name: string
    href: string
  }[]
}

const LeftNavs: FC<LeftNavsProps> = props => {
  const { navs } = props
  const [drawerVisible, setDrawerVisible] = useState(false)
  return (
    <div className='layout-sidebar'>
      <div className='layout-sidebar__pc'>
        <MenuList theme='dark' />
      </div>
      <div className='layout-sidebar__mobile'>
        <Button
          type='primary'
          icon={<MenuFoldOutlined />}
          onClick={onSwitchDrawer.bind(null, true)}
        />
      </div>
      <Drawer
        title='MenuList'
        placement='left'
        closable={false}
        onClose={onSwitchDrawer.bind(null, false)}
        visible={drawerVisible}
      >
        <MenuList theme='light' />
      </Drawer>
    </div>
  )

  function MenuList({ theme }: { theme: 'dark' | 'light' }): JSX.Element {
    return (
      <Menu mode='inline' theme={theme}>
        {navs.map((item, index) => (
          <Menu.Item key={index} onClick={toPage.bind(null, item.href)}>
            {item.name}
          </Menu.Item>
        ))}
      </Menu>
    )
  }

  function toPage(url: string): void {
    window.location.href = '#/' + url
  }

  function onSwitchDrawer(visible: boolean = false): void {
    setDrawerVisible(visible)
  }
}
export default LeftNavs
