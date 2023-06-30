import React, {useEffect, useState} from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Image,
  Alert,
  Modal,
  Row,
  Col,
  Tooltip,
  PageHeader,
  DatePicker,
  Select
} from "antd";
import {useSelector} from "react-redux";
import {Link, Redirect, useHistory} from "react-router-dom";
import {useSpring, animated} from "react-spring";
import {useParams} from "react-router";
import {useAppDispatch} from "../../../core/app.store";
import {createUser, getUserById, updateUser} from "../../../core/user/effects";
import RouteConst, {NOT_HAVE_PERMISSION_MESSAGE, passwordRegexValidateMsg, permissionList} from "../../../constants";
import {emailRegex, passwordRegex, userNameRegex} from "../../../constants/variable";
import ScrollToTop from "../../../components/ScrollToTop";
import InputPassword from "../../../components/InputPassword";
import {CalendarOutlined, CaretDownFilled, QuestionCircleTwoTone} from "@ant-design/icons";
import ReactRouterPause from '@allpro/react-router-pause';
import {getAllJobType} from "../../../core/jobType/effects";
import {createRole, getAllRole} from "../../../core/roleManage/effects";
import moment, {Moment} from "moment";
import _ from "lodash";
import {getRoleListSelector} from "../../../core/roleManage/selectors";
import {getJobTypeListOption} from "../../../core/jobType/selectors";
import {hasPermission, showNofi} from "../../../utils";
import {getUserByIdSelector} from "../../../core/user/selectors";
import SelectOption from "../../../components/SelectOption";
import {permissions} from "../../../routes/config/Permissions";
import HasPermissions from "../../../hoc/HasPermissions";


const {Title} = Typography;
const {Option} = Select;

const UserDetail = () => {

  const {id} = useParams() as { id: string | number };
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const {data: roleList} = useSelector(getRoleListSelector);
  const jobTypeListOption = useSelector(getJobTypeListOption);
  const {data: userById} = useSelector(getUserByIdSelector);

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formIsDirty, setFormIsDirty] = useState(false);


  useEffect(() => {
    dispatch(getAllJobType());
    dispatch(getAllRole());
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
    }
  }, [id]);

  useEffect(() => {
    if (userById) {

      const birthDay = userById.birthDay ? moment(userById.birthDay) : null;
      const userRole = !_.isEmpty(userById.roles) ? userById.roles[0] : null;
      const userJobType = userById.jobTypes || null;

      form.setFieldsValue({
        ...userById,
        roleId: userRole,
        jobTypeId: userJobType,
        birthDay: birthDay
      });
    }
  }, [userById]);

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

    // const password = generatePassword(12, false, /\d/);
    // form.setFieldsValue({
    //   password,
    //   confirmPassword: password,
    // });
    setShowPassword(true);
  };


  const onUpdateUser = async (data) => {

    if (!hasPermission([permissions.UPDATE_USER])) {
      showNofi('warn', NOT_HAVE_PERMISSION_MESSAGE);
      return;
    }

    setLoadingUpdate(true);

    const birthDay: Moment = (data.birthDay)?.format('YYYY-MM-DD') || null;

    const values = {
      id: id || userById.id,
      ...data,
      birthDay,
      roles: [data.roleId],
      password: data.password || null,
    };

    const resultUpdate = await dispatch(updateUser(values));
    if (updateUser.fulfilled.match(resultUpdate)) {
      showNofi('success', 'User info has been updated successfully.');
      setFormIsDirty(false);
      dispatch(getUserById(id));
      form.resetFields(['confirmPassword', 'password'])
    } else {
      showNofi('error', 'User info updated fail.');
    }
    setLoadingUpdate(false);
  };

  const onValuesChange = () => {
    setFormIsDirty(true);
  };

  return (
    <>
      <div className="createUserPage">
        <ScrollToTop/>
        <ReactRouterPause handler={handleNavigation} when={formIsDirty}/>

        <Row gutter={16}>
          <Col className="gutter-row" xs={18} sm={18} md={18} lg={18} xl={15} xxl={12}>

            <div className="pageHeading">
              <PageHeader
                title="User Details"
                extra={[<div className="title-required" key="1">* required field</div>]}
              />
            </div>

            <div>
              <Form
                form={form}
                name="form-create-user"
                hideRequiredMark
                labelCol={{span: 6}}
                wrapperCol={{span: 24}}
                labelAlign="left"
                onFinish={onUpdateUser}
                onValuesChange={() => onValuesChange()}
                autoComplete="off"
              >


                <Form.Item
                  label="User Name"
                  name="userName"
                  rules={[
                    {required: true, whitespace: true, message: 'This field is required!'},
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
                  <Input disabled/>
                </Form.Item>

                <Form.Item
                  label="Full Name"
                  name="fullName"
                  rules={[{required: true, whitespace: true, message: 'This field is required!'}]}
                >
                  <Input
                    disabled={!hasPermission([permissions.UPDATE_USER])}/>
                </Form.Item>

                <Form.Item
                  label="Email Address"
                  name="email"
                  hasFeedback
                  rules={[
                    {required: true, message: 'This field is required!'},
                    {
                      validator(rule, value) {
                        if (!value) {
                          return Promise.resolve();
                        }

                        if (!value.match(emailRegex) || value.length > 255) {
                          return Promise.reject('Please enter a valid email address');
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
                  <Input
                    disabled={!hasPermission([permissions.UPDATE_USER])}/>
                </Form.Item>

                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[{required: true, message: 'This field is required!'}]}
                >
                  <Input
                    disabled={!hasPermission([permissions.UPDATE_USER])}
                  />
                </Form.Item>

                <Form.Item
                  label="Birthday"
                  name="birthDay"
                  // style={{ marginBottom: 30 }}
                  // rules={[{ required: true, message: 'This field is required!' }]}
                >
                  <DatePicker
                    suffixIcon={<CalendarOutlined/>}
                    showToday={false}
                    popupClassName="dropdownDateBirthday"
                    className="dateBirthday"
                    inputReadOnly
                    placeholder=""
                    format="DD-MM-YYYY"
                    disabledDate={current => {
                      return current >= moment();
                    }}
                    disabled={!hasPermission([permissions.UPDATE_USER])}
                  />
                </Form.Item>

                <Form.Item
                  name="roleId"
                  label="Role"
                  // rules={[{ required: true, message: 'This field is required!' }]}
                >
                  <Select
                    // mode='multiple'
                    // suffixIcon={<CaretDownFilled/>}
                    // showArrow
                    placeholder="Select Role"
                    disabled={!hasPermission([permissions.UPDATE_USER])}
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
                  // rules={[{ required: true, message: 'This field is required!' }]}
                >
                  <SelectOption
                    data={jobTypeListOption}
                    showSearch={true}
                    mode="multiple"
                    disabled={!hasPermission([permissions.UPDATE_USER])}
                  />
                </Form.Item>

                <Form.Item wrapperCol={{span: 24}}>
                  {/*<div className="password-generate">*/}
                  {/*<Button type="link" onClick={onPasswordGenerate}>Auto Generate</Button>*/}
                  {/*</div>*/}
                  <Form.Item
                    label={
                      <>
                        Password *&nbsp;&nbsp;
                        <Tooltip
                          title="Passwords must be at least 7 characters and contain alphabetic, numeric, and special characters.">
                          <QuestionCircleTwoTone/>
                        </Tooltip>
                      </>
                    }
                    name="password"
                    rules={[
                      // { required: true, message: 'This field is required!' },
                      {
                        pattern: passwordRegex,
                        message: passwordRegexValidateMsg,
                      },
                    ]}
                    wrapperCol={{span: 18}}
                    labelCol={{span: 6}}
                    style={{marginBottom: 0}}
                    colon={false}
                  >
                    <InputPassword
                      showPassword={showPassword}
                      setshowPassword={setShowPassword}
                      autoComplete="new-password"
                      disabled={!hasPermission([permissions.UPDATE_USER])}
                    />
                  </Form.Item>
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={['password']}
                  style={{marginBottom: 30}}
                  rules={[
                    ({getFieldValue}) => ({
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
                  <InputPassword
                    showPassword={showPassword}
                    setshowPassword={setShowPassword}
                    disabled={!hasPermission([permissions.UPDATE_USER])}
                  />
                </Form.Item>

                <Form.Item className="form-buttons" wrapperCol={{span: 24}}>
                  <HasPermissions permissions={[permissions.UPDATE_USER]}>
                    <Button type="primary" htmlType="submit" loading={loadingUpdate}>Update</Button>
                  </HasPermissions>

                  <Link to={RouteConst.USER_LIST}>
                    <Button type="default" disabled={loadingUpdate}>
                      {!hasPermission([permissions.UPDATE_USER]) ? 'Back to user list' : 'Cancel'}
                    </Button>
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

export default UserDetail;
