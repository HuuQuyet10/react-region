import React, {useEffect} from "react";
import {Form, Input, Button, Typography, Image, Alert} from 'antd';
import {useSelector, useDispatch} from "react-redux";
import {Redirect, useHistory} from "react-router-dom";
import {CSSTransition} from "react-transition-group";
import {useSpring, animated} from "react-spring";
import get from 'lodash/get';

import "./style.scss";
import logo from "../../assets/images/logo.png";
import {clearState as clearLoginState} from "../../core/admin/admin.slice";
import {login} from "../../core/admin/effects/admin.effects";
import {RootState} from "../../core/app.store";
import _ from "lodash";
import {getLoadingLogin, getLoginUserSelector} from "../../core/admin/selectors";

const {Title} = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const history = useHistory();

  const isLoading = useSelector(getLoadingLogin);
  const isSuccess = useSelector((state: RootState) => get(state.curUserLogin, 'isSuccess', false));
  const errorMessage = useSelector((state: RootState) => get(state.curUserLogin, 'errorMessage', ''));
  const loginUser = useSelector(getLoginUserSelector);

  const dispatch = useDispatch();
  const fadeInUp = {
    delay: 100,
    from: {
      opacity: 0,
      translateY: 80
    },
    to: {
      opacity: 1,
      translateY: 0
    }
  };
  const fadeInUp1 = useSpring(fadeInUp);
  const fadeInUp2 = useSpring({...fadeInUp, delay: 300});

  const onFinish = (data) => {
    dispatch(clearLoginState());

    dispatch(login(data));
  };

  useEffect(() => {
    dispatch(clearLoginState());
  }, []);

  useEffect(() => {
    if (!_.isEmpty(loginUser)) {
      history.push('/');
    }
  }, [loginUser]);

  useEffect(() => {
    if (isSuccess) {
      history.push('/');
      dispatch(clearLoginState());
    }
  }, [isSuccess]);

  const initialValues = {
    username: "admin",
    password: "12345678"
  };
  form.setFieldsValue(initialValues);

  return (
      <div className="loginPage">
        <Form
            layout="vertical"
            form={form}
            requiredMark={false}
            name="loginForm"
            className="loginForm"
            onFinish={onFinish}
        >
          <animated.div style={fadeInUp1}>
            <div style={{textAlign: 'center'}}><Image width={300} src={logo} preview={false}/></div>
          </animated.div>

          <animated.div style={fadeInUp2}>
            <Title level={2}>Login</Title>


            <CSSTransition
                in={errorMessage != ''}
                timeout={300}
                unmountOnExit
                classNames="alert">
              <Alert message={errorMessage} type="error" className="errorMessage"/>
            </CSSTransition>

            <Form.Item
                label="Username"
                name="username"
                rules={[
                  {required: true, message: "Please input your email username!"}
                ]}
            >
              <Input value="dfdsf"/>
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                  {required: true, message: "Please input your password!"}
                ]}
            >
              <Input.Password/>
            </Form.Item>

            <Form.Item className="btnContainer">
              {/*<Button type="link"*/}
              {/*className="forgotBtn"*/}
              {/*disabled={isLoading} >Forgot Your Password?</Button>*/}

              <Button type="primary"
                      htmlType="submit"
                      loading={isLoading}
                      size="large"
                      className="submitBtn">Login</Button>
            </Form.Item>
          </animated.div>
        </Form>
      </div>
  )

}

export default LoginPage;
