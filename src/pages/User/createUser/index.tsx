import React, {useEffect, useState} from "react";
import {Form, Input, Button, Typography, Image, Alert, PageHeader, Row, Col, Tooltip, Modal, Select, DatePicker} from 'antd';
import {useSelector} from "react-redux";
import {Link, Redirect, useHistory} from "react-router-dom";
import {useSpring, animated} from "react-spring";
import {useParams} from "react-router";
import {useAppDispatch} from "../../../core/app.store";
import {createUser, getUserById, updateUser} from "../../../core/user/effects";
import {emailRegex, passwordRegex, userNameRegex} from "../../../constants/variable";
import InputPassword from "../../../components/InputPassword";
import RouteConst, {NOT_HAVE_PERMISSION_MESSAGE, passwordRegexValidateMsg, StatusUser} from "../../../constants";
import {CalendarOutlined, CaretDownFilled, QuestionCircleTwoTone} from "@ant-design/icons";
import ReactRouterPause from '@allpro/react-router-pause';
import ScrollToTop from "../../../components/ScrollToTop";
import './styles.scss';
import {hasPermission, showNofi} from "../../../utils";
import moment, {Moment} from "moment";
import _ from "lodash";
import {getAllRole} from "../../../core/roleManage/effects";
import {getAllJobType} from "../../../core/jobType/effects";
import {getJobTypeListOption} from "../../../core/jobType/selectors";
import {getRoleListSelector} from "../../../core/roleManage/selectors";
import generatePassword from "password-generator";
import SelectOption from "../../../components/SelectOption";
import {permissions} from "../../../routes/config/Permissions";


const {Title} = Typography;
const {Option} = Select;

const CreateUser = () => {

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();


  const {data: roleList} = useSelector(getRoleListSelector);
  const jobTypeListOption = useSelector(getJobTypeListOption);

  const [showPassword, setShowPassword] = useState(false);
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [isLoadingCreateUser, setIsLoadingCreateUser] = useState(false);



  useEffect(() => {
    dispatch(getAllJobType());
    dispatch(getAllRole());
  }, []);


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


  const onPasswordGenerate = () => {

    showNofi('error', "This function currently doesn't work, waiting for update later.");

    // const password = generatePassword(8, false, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
    // form.setFieldsValue({
    //   password,
    //   confirmPassword: password,
    // });
    // setShowPassword(true);
  };


  const onCreateUser = async (data) => {
    if (!hasPermission([permissions.ADD_USER])){
      showNofi('warn', NOT_HAVE_PERMISSION_MESSAGE);
      return;
    }

    setIsLoadingCreateUser(true);

    const birthDay: Moment = (data.birthDay)?.format('YYYY-MM-DD') || null;

    const values = {
      ...data,
      status: StatusUser.ACTIVE,
      password: data.password,
      birthDay: birthDay,
      roles: [data?.roles]
    };

    const resultCreate = await dispatch(createUser(values));
    if (createUser.fulfilled.match(resultCreate)){
      showNofi('success', 'User has been created successfully.');
      form.resetFields();
      setFormIsDirty(false);
    } else {
      showNofi('error', 'User created fail.');
    }

    setIsLoadingCreateUser(false);
  };

  const onValuesChange = () => {
    setFormIsDirty(true);
  };



  return (
    <>
      <div className="createUserPage">
        <ScrollToTop />
        <ReactRouterPause handler={handleNavigation} when={formIsDirty} />

        <Row gutter={16}>
          <Col className="gutter-row" xs={18} sm={18} md={18} lg={18} xl={15} xxl={12}>

        <div className="pageHeading">
          <PageHeader
            title="Create User"
            extra={[<div className="title-required" key="1">* required field</div>]}
          />
        </div>

        <div>
          <Form
            form={form}
            name="form-create-user"
            // hideRequiredMark
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 24 }}
            labelAlign="left"
            onFinish={onCreateUser}
            onValuesChange={() => onValuesChange()}
            autoComplete="off"
          >

            <Form.Item
              label="User Name"
              name="userName"
              rules={[
                { required: true, whitespace: true, message: 'User Name is required' },
                {
                  validator(rule, value) {
                    if (!value) {
                      return Promise.resolve();
                    }

                    if (!value.match(userNameRegex)) {
                      return Promise.reject('User Name only allow letter and number');
                    }

                    return Promise.resolve();
                    // return getUserByEmail(value).then(
                    //   () => Promise.reject('The email address entered is already existed in the system.'),
                    //   () => Promise.resolve()
                    // );
                  },
                },
                ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, whitespace: true, message: 'Full Name is required' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="email"
              hasFeedback
              rules={[
                { required: true, message: 'Email is required' },
                {
                  validator(rule, value) {
                    if (!value) {
                      return Promise.resolve();
                    }

                    if (!value.match(emailRegex) || value.length > 255) {
                      return Promise.reject('Email format is invalid');
                    }

                    return Promise.resolve();
                    // return getUserByEmail(value).then(
                    //   () => Promise.reject('The email address entered is already existed in the system.'),
                    //   () => Promise.resolve()
                    // );
                  },
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[{ required: true, message: 'Phone Number is required' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Birthday"
              name="birthDay"
              // style={{ marginBottom: 30 }}
              // rules={[{ required: true, message: 'This field is required!' }]}
            >
              <DatePicker
                suffixIcon={<CalendarOutlined />}
                showToday={false}
                popupClassName="dropdownDateBirthday"
                className="dateBirthday"
                inputReadOnly
                placeholder=""
                format="DD-MM-YYYY"
                disabledDate={current => {
                  return current >= moment();
                }}
              />
            </Form.Item>

            <Form.Item
              name="roles"
              label="Role"
              rules={[{ required: true, message: 'Please select a role' }]}
            >
              <Select
                // mode='multiple'
                // suffixIcon={<CaretDownFilled/>}
                // showArrow
                placeholder="Select Role"
              >
                {_.map(roleList, (item, index) => {
                  return (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  )
                })}
              </Select>
            </Form.Item>

            <Form.Item
              name="jobTypes"
              label="Job Type"
              rules={[{ required: true, message: 'Please select job type' }]}
            >
              <SelectOption data={jobTypeListOption}
                            mode='multiple'
                            showArrow
                            showSearch={true}
                            placeholder="Select Job Type" />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              {/*<div className="password-generate">*/}
                {/*<Button type="link" onClick={onPasswordGenerate}>Auto Generate</Button>*/}
              {/*</div>*/}
              <Form.Item
                label={
                  <>
                    Password *&nbsp;&nbsp;
                    <Tooltip title="Passwords must be at least 8 characters and contain uppercase, lowercase, numeric, at least 1 character: '@ $ ! % * ? &' and at least 1 uppercase character">
                      <QuestionCircleTwoTone />
                    </Tooltip>
                  </>
                }
                name="password"
                rules={[
                  { required: true, message: 'Password is required' },
                  {
                    pattern: passwordRegex,
                    message: passwordRegexValidateMsg,
                  },
                ]}
                wrapperCol={{ span: 18 }}
                labelCol={{ span: 6 }}
                style={{ marginBottom: 0 }}
                colon={false}
              >
                <InputPassword
                  showPassword={showPassword}
                  setshowPassword={setShowPassword}
                  autoComplete="new-password"
                />
              </Form.Item>
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              style={{ marginBottom: 30 }}
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    const password = getFieldValue('password');
                    if ((!password && !value) || password === value) {
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
              <Button type="primary" htmlType="submit" loading={isLoadingCreateUser}>Create</Button>

              <Link to={RouteConst.USER_LIST}>
                <Button type="default">Cancel</Button>
              </Link>
            </Form.Item>
          </Form>
        </div>

          </Col>
      </Row>

      </div>
    </>
  )

}

export default CreateUser;
