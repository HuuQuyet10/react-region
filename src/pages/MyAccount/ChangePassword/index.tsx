import React, {useEffect, useState} from "react";
import ReactDom from 'react-dom';
import {Button, Col, Form, Image, Modal, PageHeader, Row, Tooltip} from "antd";
import './style.scss';
import {AppDispatch, useAppDispatch} from "../../../core/app.store";
import ReactRouterPause from '@allpro/react-router-pause';
import {getSafeValue, showNofi} from "../../../utils";
import {changePasswordAct} from "../../../core/admin/effects";
import {passwordRegex} from "../../../constants/variable";
import {passwordRegexValidateMsg} from "../../../constants";
import {QuestionCircleTwoTone} from "@ant-design/icons/lib";
import InputPassword from "../../../components/InputPassword";
import {Link} from "react-router-dom";
import RouteConst from "../../../constants";


function ChangePassword (){

  const [form] = Form.useForm();
  const dispatch: AppDispatch  = useAppDispatch();

  const [formIsDirty, setFormIsDirty] = useState(false);
  const [loadingSubmitChangePassword, setLoadingSubmitChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const onSubmitChangePassword = async data => {
    setLoadingSubmitChangePassword(true);

    const payload = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };

    const resultChange = await dispatch(changePasswordAct(payload));
    if (changePasswordAct.fulfilled.match(resultChange)) {
      showNofi('success', 'Your password has been changed successfully.');
      form.resetFields();
      setFormIsDirty(false);
    } else {

      showNofi('error', getSafeValue(resultChange.payload, 'message', '') || 'There is an error when change your password');
    }

    setLoadingSubmitChangePassword(false)
  };

  const onValuesChange = () => {
    setFormIsDirty(true);
  };


  const handleNavigation = (navigation, location, action) => {
    Modal.confirm({
      content: 'Any unsaved changes will be lost.\nDo you want to proceed?',
      okText: 'Yes',
      cancelText: 'No',
      width: 330,
      className: 'navigation-confirm',
      centered: true,
      onOk() {
        navigation.resume();
      },
      onCancel() {
        navigation.cancel();
      },
    });

    return null;
  };

  return (
    <div className="pageChangePassword">

      <ReactRouterPause handler={handleNavigation} when={formIsDirty} />



      <Row gutter={16}>
        <Col className="gutter-row" xs={18} sm={18} md={18} lg={18} xl={15} xxl={12}>

          <div className="pageHeading">
            <PageHeader
              title="Change your password"
              extra={[<div className="title-required" key="1">* required field</div>]}
            />
          </div>

          <Form
            form={form}
            name="form-change-pasword"
            onFinish={onSubmitChangePassword}
            onValuesChange={() => onValuesChange()}
            autoComplete="off"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 24 }}
            labelAlign="left"
            colon={false}
          >

            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[
                { required: true, message: 'Current Password is required' }
              ]}
            >
              <InputPassword
                showPassword={showPassword}
                setshowPassword={setShowPassword}
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              label={
                <>
                  Password *&nbsp;&nbsp;
                  <Tooltip title="Passwords must be at least 8 characters and contain uppercase, lowercase, numeric, at least 1 character: '@ $ ! % * ? &' and at least 1 uppercase character">
                    <QuestionCircleTwoTone />
                  </Tooltip>
                </>
              }
              name="newPassword"
              rules={[
                { required: true, message: 'New Password is required' },
                {
                  pattern: passwordRegex,
                  message: passwordRegexValidateMsg,
                },
              ]}
            >
              <InputPassword
                showPassword={showPassword}
                setshowPassword={setShowPassword}
                autoComplete="new-password"
              />
            </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  const newPassword = getFieldValue('newPassword');
                  if ((!newPassword && !value) || newPassword === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Confirm password does not match entered password.');
                },
              }),
            ]}
          >
            <InputPassword showPassword={showPassword} setshowPassword={setShowPassword} />
          </Form.Item>

            <Form.Item className="form-buttons" wrapperCol={{ span: 24 }}>
              <Button type="primary" htmlType="submit" loading={loadingSubmitChangePassword}>Change Password</Button>
            </Form.Item>

          </Form>
        </Col>
      </Row>
    </div>
  )
}


export default ChangePassword;