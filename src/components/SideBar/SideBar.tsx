import React, { useState, useEffect } from 'react';
import logo from "../../assets/images/logo-white.png";
import {Image, Layout, Menu, MenuProps} from "antd";
import {DesktopOutlined, UserOutlined} from "@ant-design/icons";
import {NavLink, useLocation} from "react-router-dom";
import _ from 'lodash';
import './styles.scss';
import {RouteConfig} from "../../routes/config/PrivateRoutesConfig";

const { SubMenu } = Menu;
const {Sider} = Layout;


type MenuItem = Required<MenuProps>['items'][number];

const SideBar = (props: any) => {
  const {routes} = props;

    const [collapsed, setCollapsed] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const location = useLocation();

  let activeMenu = '';

  // useEffect(() => {
  //   const menuItems = getMenuFromConfig(routes);
  //   setMenuItems(menuItems);
  // }, [])

  const links = (
    <>
      {!_.isEmpty(routes) ? routes.map((menu, key) => {

        if (menu['keyMenu']) {
          return (
            <SubMenu
              key={menu['keyMenu']}
              popupClassName="sidebarSubMenu"
              icon={
                <span className="icnMenu" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <menu.icon />
                </span>
              }
              title={<span className="textMenuItem">{menu['name']}</span>}
            >
              {!_.isEmpty(menu['children']) &&
              _.map(menu['children'], (item: any, key) => {
                return (
                  <React.Fragment key={key}>
                    <Menu.Item key={item['path']}>
                      <NavLink to={item['path']}>{item['name']}</NavLink>
                    </Menu.Item>
                  </React.Fragment>
                );
              })}
            </SubMenu>
          );
        }
        return (
          <Menu.Item
            key={menu['path']}
            style={{ display: 'flex', alignItems: 'center' }}
            icon={
              menu.icon && (
                <span className="icnMenu" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <menu.icon />
                </span>
              )
            }
          >
            <NavLink to={menu.path} className='menuItem' activeClassName="active123">
              <span className="textMenuItem">{menu.name}</span>
            </NavLink>
          </Menu.Item>
        );
      }) : null}
      </>
  );

  const getMenuFromConfig = (routers: RouteConfig[], keyItem?: string | number) => {

    const menuItem = routers?.map((item: RouteConfig, index) => {
      return {
        label: <>
          {item.children ?
            item['name']
            : <NavLink to={item['path']}>{item['name']}</NavLink>
          }
        </>,
        key: `${keyItem || ''}${index}`,
        icon: item.icon ? <>
          <span className="icnMenu" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: '5px'}}>
            <item.icon />
          </span>
        </> : null,
        children: item.children ? getMenuFromConfig(item.children, index) : null,
        // type: item.children ? 'group' : null,
      }
    });

    return menuItem;

  };

  // const menuItem: MenuProps['items'] = getMenuFromConfig(routes);

  return (
      <Sider collapsible collapsed={collapsed}
             width={250}
             className="mainSidebar"
             collapsedWidth={55}
             onCollapse={() => setCollapsed(!collapsed)}>

        <div className='sidebarInner'>
          <div className="logo">
            <Image src={logo} preview={false} width='100%'/>
          </div>

          <div className="menuSidebar">
            <Menu
              selectedKeys={[location.pathname, activeMenu]}
              theme="dark"
              className="sideMenu"
              mode={'inline'}
              // items={menuItems}
              // inlineIndent={14}
              // openKeys={openKeys} onOpenChange={onOpenChange}
              // inlineCollapsed={!isShowMenu}
            >
              {links}
            </Menu>
          </div>
        </div>

      </Sider>
  );
};

export default SideBar;
