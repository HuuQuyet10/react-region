import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import LoadingSpin from "../../components/LoadingSpin";
import {Container} from "react-bootstrap";
import {RootState} from '../../core/app.store';
import {Layout, Spin, Avatar, Popover, Row, Col, Modal, Button, notification} from "antd";

import {DesktopOutlined, UserOutlined, LoadingOutlined, CaretDownOutlined} from "@ant-design/icons";
import {useLocation} from "react-router";
import {logout} from '../../core/admin/admin.slice';
import logo from "../../assets/images/logo.png";
import get from 'lodash/get';
import {getLoginUserSelector} from "../../core/admin/selectors";
import {Link} from "react-router-dom";
import * as RouteConst from "../../constants/RouteConst";
import {getBroadcastsMessageSelector, selectAllActiveBroadcasts} from "../../core/user/selectors";


const {Header, Sider, Content, Footer} = Layout;

const PrivateLayout = (props) => {

  const dispatch = useDispatch();

  const admin = useSelector(getLoginUserSelector);
  const contentBroadcasts = useSelector(selectAllActiveBroadcasts);

  const [avatarPopoverVisible, setAvatarPopoverVisible] = useState(false);

  const loadingGetJobType = useSelector((state: RootState) => get(state.jobType, 'loadingScreen', false));

  const loading = loadingGetJobType || false;

  const logOut = () => {
    dispatch(logout());
  };


  const confirmLogoutModal = () => {
    Modal.confirm({
      content: 'Do you want to log out?',
      okText: 'Yes',
      cancelText: 'No',
      width: 330,
      className: 'navigation-confirm',
      centered: true,
      maskClosable: true,
      onOk() {
        logOut();
      },
      onCancel() {
      },
    });
    return null;
  };

  const contentPopover = (
    <div className="popoverUserProfile">
      <ul>
        <li><Link to={RouteConst.MY_ACCOUNT_CHANGE_PASSWORD}>Change Password</Link></li>
        <li><a onClick={() => confirmLogoutModal()}>Logout</a></li>
      </ul>
    </div>
  );

  return (
    <Layout className="privateRouteMain" style={{minHeight: '100vh'}}>
      <Header className="header">
        <Container>
          <Row>
            {/*<Col span={12}>*/}
            {/*<div className="logo">*/}
            {/*<img src={logo} height={64}/>*/}
            {/*</div>*/}
            {/*</Col>*/}
            <Col span={24}>
              <div id="userPopover" className="userPopover">
                <Popover
                  content={contentPopover}
                  trigger="click"
                  open={avatarPopoverVisible}
                  onOpenChange={() => setAvatarPopoverVisible(!avatarPopoverVisible)}
                  placement="bottomRight"
                >
                  <Button type="link" className="btnEmployeeName">
                    {admin?.fullName}
                    <CaretDownOutlined/>
                  </Button>
                </Popover>
              </div>


            </Col>

          </Row>

        </Container>
      </Header>
      <div className="privateContainer">
        <Spin
          spinning={loading}
          size="large"
          indicator={<LoadingSpin/>}
          wrapperClassName={`${loading ? 'page-loading' : ''}`}
        >
          <div className="">
            <div className="privatePageMain">

              <Container>
                {contentBroadcasts &&
                <div className="contentBroadcasts"><span dangerouslySetInnerHTML={{__html: contentBroadcasts || ''}}/>
                </div>
                }
                <Content>{props.children}</Content>
              </Container>

            </div>
          </div>
        </Spin>

      </div>
      {/*<Footer>*/}
      {/*<Container>*/}
      {/*<div>Craft with ❤️&nbsp; from JMango360</div>*/}
      {/*</Container>*/}
      {/*</Footer>*/}
    </Layout>
  );
};

export default PrivateLayout;
