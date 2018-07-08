import React, { PureComponent } from 'react';
import { Balloon, Icon, Button, Feedback } from '@icedesign/base';
import IceImg from '@icedesign/img';
import Layout from '@icedesign/layout';
import Menu from '@icedesign/menu';
import FoundationSymbol from 'foundation-symbol';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import headerMenuConfig from './../menuConfig';
import Logo from './Logo';

import { Grid } from "@icedesign/base";
const { Row, Col } = Grid;
import { Search } from "@icedesign/base";
import axios from 'axios';
import ud from '../utilities/UrlDictionary'
import {withRouter} from 'react-router-dom';

class Header extends PureComponent {
  onLogoutClick() {
    axios.post(ud.getInstance().api("logout")).then((response) => {
      console.log(response);
      if (response.data.success) {
        localStorage.removeItem('user_info');
        localStorage.removeItem('expire_date');
        Feedback.toast.success('退出成功');
        window.location.reload();
      }
    });
  }

  onSearchClick() {
    Feedback.toast.success('not implemented yet');
  }

  render() {
    const { width, theme, isMobile, className, style } = this.props;
    var userInfo = null;
    if(localStorage.getItem('expire_date') > new Date().getTime()) { // one month
      if(localStorage.getItem('user_info') != undefined) {
        userInfo = JSON.parse(localStorage.getItem('user_info'));
      }
    }
    return (
      <Layout.Section style={{ minHeight: '10vh' }}>
        <Layout.Aside width='12.5%'/>
      <Layout.Main
        theme={theme}
        className={cx('ice-design-layout-header', className)}
        style={{ ...style, width }}
      >
        <Logo />
        <div
          className="ice-design-layout-header-menu"
          style={{ display: 'flex' }}
        >
          {/* Header 菜单项 begin */}
          {headerMenuConfig && headerMenuConfig.length > 0 ? (
            <Menu mode="horizontal" selectedKeys={[]}>
              {headerMenuConfig.map((nav, idx) => {
                const linkProps = {};
                if (nav.newWindow) {
                  linkProps.href = nav.path;
                  linkProps.target = '_blank';
                } else if (nav.external) {
                  linkProps.href = nav.path;
                } else {
                  linkProps.to = nav.path;
                }
                return (
                  <Menu.Item key={idx}>
                    {linkProps.to ? (
                      <Link {...linkProps}>
                        {nav.icon ? (
                          <FoundationSymbol type={nav.icon} size="small" />
                        ) : null}
                        {!isMobile ? nav.name : null}
                      </Link>
                    ) : (
                      <a {...linkProps}>
                        {nav.icon ? (
                          <FoundationSymbol type={nav.icon} size="small" />
                        ) : null}
                        {!isMobile ? nav.name : null}
                      </a>
                    )}
                  </Menu.Item>
                );
              })}
            </Menu>
          ) : null}
          {/* Header 菜单项 end */}

          {/* Header 右侧内容块 */}

          <Search
          size="large"
          inputWidth={200}
          placeholder="搜索你感兴趣的课程"
          searchText=""
          style={{
            padding: 4
          }}
          onSearch={this.onSearchClick}
        />
        {(userInfo != null)?
        (
          <Balloon
            trigger={
              <div
                className="ice-design-header-userpannel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 12,
                }}
              >
                <IceImg
                  height={40}
                  width={40}
                  src={
                    userInfo.avatar_url == null ? '//img.alicdn.com/tfs/TB1nf.WjyqAXuNjy1XdXXaYcVXa-245-245.gif' : userInfo.avatar_url
                  }
                  className="user-avatar"
                />
                <div className="user-profile">
                  <span className="user-name" style={{ fontSize: '13px' }}>
                    {userInfo.name}
                  </span>
                  <br />
                  <span
                    className="user-department"
                    style={{ fontSize: '12px', color: '#999' }}
                  >
                    {(userInfo.teacher_id != null) ? '认证教师' : '普通用户'}
                  </span>
                </div>
                <Icon
                  type="arrow-down-filling"
                  size="xxs"
                  className="icon-down"
                />
              </div>
            }
            closable={false}
            className="user-profile-menu"
          >
            <ul>
              <li className="user-profile-menu-item">
                <Link to="/myhome">
                  <FoundationSymbol type="person" size="small" />我的主页
                </Link>
              </li>
              <li className="user-profile-menu-item">
                <Link to="/userinfo">
                  <FoundationSymbol type="repair" size="small" />修改信息
                </Link>
              </li>
              <li className="user-profile-menu-item">
                <Link to="/" onClick={this.onLogoutClick}>
                  <FoundationSymbol type="compass" size="small"  />退出
                </Link>
              </li>
            </ul>
          </Balloon>
        ) : 
          <Button type="primary" size="large" href="/#/signin" component="a" style={{margin: "4px 0 0 0" }}>登录</Button>
        }

        </div>
      </Layout.Main>
      <Layout.Aside width='12.5%'/>
      </Layout.Section>
    );
  }
}

export default withRouter(Header);