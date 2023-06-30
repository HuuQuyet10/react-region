import React, {useEffect, useState} from 'react';
import RouteConst, {DateFormatFull, RoleConst} from '../../../constants';
import moment, {Moment} from 'moment';
import _ from 'lodash';
import ScrollToTop from '../../../components/ScrollToTop';
import {
  Modal,
  Row,
  Col,
  PageHeader,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  UploadProps,
  InputNumber, Tooltip, Space
} from 'antd';

import ReactRouterPause from '@allpro/react-router-pause';
import {Link} from 'react-router-dom';
import {CalendarOutlined, UploadOutlined} from '@ant-design/icons';
import {useAppDispatch} from '../../../core/app.store';
import {createJob} from '../../../core/jobManage/effects/job.effects';
import {hasPermission, showNofi} from '../../../utils';
import {getAllJobType} from '../../../core/jobType/effects';
import {getJobTypeListOption} from '../../../core/jobType/selectors';
import {useSelector} from 'react-redux';

import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import {Storage} from '@aws-amplify/storage';
import awsExports from '../../../aws-exports';
import CustomUpload from "../../../components/CustomUpload";
import ReactQuill, {Quill} from 'react-quill';
import {ReactQuillEditorFormats, ReactQuillModules} from '../../../constants/editorSettings';
import CustomFileDownload from "../../../components/CustomFileDownload";
import {getCustomerListAct, getQcListAct, getStaffListAct, getUserList} from "../../../core/user/effects";
import {
  getAllCustomerOption,
  getAllQCOption,
  getAllStaffOption,
} from '../../../core/user/selectors';
import SelectConfirm from "../../../components/SelectConfirm";
import {JobStatusOptions, JobStatusValue} from "../../../constants/options";
import SelectOption from "../../../components/SelectOption";
import {MinusCircleOutlined, PlusOutlined, QuestionCircleTwoTone} from "@ant-design/icons/lib";
import {permissions} from "../../../routes/config/Permissions";
import {getLoginUserSelector} from "../../../core/admin/selectors";
import {disabledDateTime} from "../../../utils/dateUtils";

Amplify.configure(awsExports);
Auth.configure(awsExports);
Storage.configure(awsExports);

const {TextArea} = Input;
const {Option} = Select;

const CreateJob = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const loginUser = useSelector(getLoginUserSelector);

  const jobTypeListOption = useSelector(getJobTypeListOption);

  const listStaffOption = useSelector(getAllStaffOption);
  const listQcOption = useSelector(getAllQCOption);
  const listCustomerOption = useSelector(getAllCustomerOption);
  // const {data: listAllUser} = useSelector(getUserListSelector);

  const [loadingCreateJob, setLoadingCreateJob] = useState(false);
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [fileUpload, setFileUpload] = useState<string>('');
  // const [aaa, setAaa] = useState<any>();
  const [selectedStaffID, setSelectedStaffID] = useState<number>();
  const [selectedQcID, setSelectedQcID] = useState<number>();

  const aaa = [
    {
      "jobTypeId": 4,
      "quantity": 2
    },
    {
      "jobTypeId": 4,
      "quantity": 3
    },
    {
      "jobTypeId": 5,
      "quantity": 99
    }
  ]

  useEffect(() => {

    getUserListForOption();
    getAllJobTypeForOption();

    form.setFieldsValue({
      status: JobStatusValue.CREATED
    });

    form.setFieldsValue({
      items: aaa
    })

    return () => {
      console.log('******************* UNMOUNTED');
    };
  }, []);

  useEffect(() => {
    if (loginUser) {
      if (loginUser.roles.includes(RoleConst.CUSTOMER)) {
        form.setFieldValue('customerId', loginUser.id);
      }
    }
  }, [loginUser]);


  const getUserListForOption = () => {
    // dispatch(getUserList({status: UserStatus.ACTIVE}));
    if (hasPermission([permissions.FIND_WORKER])) {
      dispatch(getQcListAct({}));
      dispatch(getStaffListAct({}));
    }
    if (hasPermission([permissions.FIND_CUSTOMER])) {
      dispatch(getCustomerListAct({}));
    }
  };

  const getAllJobTypeForOption = () => {
    dispatch(getAllJobType());
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


  const onValuesChange = () => {
    setFormIsDirty(true);
  };

  const onCreateJob = async data => {
    // setLoadingCreateJob(true);

    const deadline: Moment = data.deadline?.format('YYYY-MM-DD HH:mm:ss') || null;

    const values = {
      status: JobStatusValue.CREATED,
      ...data,
      deadline: deadline,
      attachment: !_.isEmpty(fileList) ? fileList[0] : '',
      qc: selectedQcID,
      staff: selectedStaffID,
    };

    console.log('values', values);

    if (!loginUser.roles.includes(RoleConst.CUSTOMER)) {
      if (_.isEmpty(values.items)) {
        showNofi('warn', 'Chưa thêm job type, vui lòng thêm job type để tạo job', 4, 'waningEmptyJobType');
        return;
      }
    }

    const resultCreate = await dispatch(createJob(values));
    if (createJob.fulfilled.match(resultCreate)) {
      showNofi('success', 'A new job has been created successfully.');
      form.resetFields();
      form.setFieldValue('status', JobStatusValue.CREATED);
      setFormIsDirty(false);
      setSelectedQcID(undefined);
      setSelectedStaffID(undefined);
      setFileList([])
    } else {
      showNofi('error', 'A new job created fail.');
    }
    setLoadingCreateJob(false)
  };

  async function onChange(e) {
    const file = e.target.files[0];
    console.log('e', e)
    console.log('e.target.files', e.target.files[0])
    try {
      const aa = await Storage.put(file.name, file, {
        resumable: true,
        progressCallback(progress) {
          console.log(`Uploaded: ${Math.floor((progress?.loaded / progress?.total) * 100)}%`);
        },
        completeCallback: event => {
          console.log(`Successfully uploaded ${event.key}`);
        },
      });
      console.log('aa', aa)
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener('click', clickHandler);
      }, 150);
    };
    a.addEventListener('click', clickHandler, false);
    a.click();
    return a;
  }

  const onUploadComplete = (urlDownload: string) => {
    if (urlDownload) {
      setFileList([urlDownload]);
      // setFileUpload(urlDownload);
    }
  };


  const confirmChangeAssignStaff = (staffUserId) => {

    setSelectedStaffID(staffUserId);

    // validate ant form manual
    form.validateFields().then((values) => {
      console.log('values', values)
      // setSelectedStaffID(staffUserId);
    })
      .catch((errorInfo) => {
        console.log('errorInfo', errorInfo);
        console.log('điền form đi đã')
      });

  };

  const validateRequired = (_, value) => {
    if (!value || value.length === 0) {
      return Promise.reject('This field is required');
    }
    return Promise.resolve();
  };


  return (
    <>
      <div className="createJobPage">
        <ScrollToTop/>
        <ReactRouterPause handler={handleNavigation} when={formIsDirty}/>

        <Row gutter={16}>
          <Col className="gutter-row" span={24}>
            <div className="pageHeading">
              <PageHeader
                title="Create Job"
                extra={[
                  <div className="title-required" key="1">
                    * required field
                  </div>,
                ]}
              />
            </div>
          </Col>

          <Col className="gutter-row" xs={24} sm={24} md={24} lg={16} xl={17} xxl={17}>

            <div>
              <Form
                form={form}
                name="form-create-job"
                labelCol={{span: 6}}
                wrapperCol={{span: 24}}
                labelAlign="left"
                onFinish={onCreateJob}
                onValuesChange={() => onValuesChange()}
                autoComplete="off"
                colon={false}
              >
                <Form.Item
                  label="Title Job"
                  name="name"
                  rules={[{required: true, message: 'This field is required!'}]}
                >
                  <Input/>
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{required: true, message: 'This field is required!'}]}
                >
                  {/*<TextArea rows={10} />*/}
                  <ReactQuill
                    theme={'snow'}
                    // onChange={this.handleChange}
                    // value={this.state.editorHtml}
                    modules={ReactQuillModules}
                    formats={ReactQuillEditorFormats}
                    className="qillEditor"
                    // bounds={'.app'}
                    // placeholder={this.props.placeholder}
                  />
                </Form.Item>

                <Form.Item
                  label="Job types"
                  rules={[{required: true}]}>
                  <Form.List name="items"
                    rules={[{ validator: (_, value) => {
                        if (!value || value.length === 0) {
                          return Promise.reject('This field is required');
                        }
                        return Promise.resolve();
                      } }]}
                  >
                    {(fields, {add, remove}) => (
                      <React.Fragment>
                        {fields.map(({key, name, ...restField}) => (
                          <Row gutter={16} key={key}>
                            <Col className="gutter-row" xs={12} xl={10}>
                              <Form.Item
                                {...restField}
                                name={[name, 'jobTypeId']}
                                rules={[{required: true, message: 'Job type is required!'}]}
                              >
                                <SelectOption
                                  data={jobTypeListOption}
                                  showSearch={true}
                                  onLoadmore={(keyword) => {
                                    console.log('key search', keyword)
                                  }}
                                />
                              </Form.Item>
                            </Col>

                            <Col className="gutter-row" xs={8} xl={5}>
                              <Form.Item
                                {...restField}
                                name={[name, 'quantity']}
                                rules={[{required: true, message: 'Quantity is required!'}]}
                              >
                                <InputNumber
                                  addonAfter={'ảnh'}
                                  style={{width: '100%'}}
                                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                />
                              </Form.Item>
                            </Col>

                            <Col className="gutter-row" xs={1}>
                              <MinusCircleOutlined style={{top: '3px', position: 'relative'}}
                                                   onClick={() => remove(name)}/>
                            </Col>
                          </Row>
                        ))}

                        <Form.Item>
                          <Row gutter={16}>
                            <Col xs={12} xl={10}>
                              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                Add Job Type
                              </Button>
                            </Col>
                          </Row>
                        </Form.Item>

                      </React.Fragment>
                    )}
                  </Form.List>
                </Form.Item>

                <Form.Item
                  label="Deadline"
                  name="deadline"
                  rules={[
                    {required: true, message: 'This field is required!'},
                    {validator(rule, value) {
                        if (!value) {
                          return Promise.resolve();
                        }
                        if (value < moment()) {
                          return Promise.reject('Deadline is not valid!');
                        }
                        return Promise.resolve();
                      }
                    },
                    ]}>
                  <DatePicker
                    suffixIcon={<CalendarOutlined/>}
                    showToday={false}
                    popupClassName="dropdownDateBirthday"
                    className="dateBirthday"
                    inputReadOnly
                    placeholder=""
                    showTime={{
                      format: 'HH:mm',
                      minuteStep: 5,
                      showNow: true,
                      hideDisabledOptions: true,
                    }}
                    format={DateFormatFull}
                    disabledDate={current => {
                      return current && current < moment().startOf('day')
                    }}
                    disabledTime={disabledDateTime}

                  />
                </Form.Item>

                <Form.Item label="Upload">
                  <CustomUpload onComplete={(fileName) => onUploadComplete(fileName)}/>
                </Form.Item>

                <Form.Item label={' '} colon={false}>
                  <CustomFileDownload urlsDownload={fileList}/>
                </Form.Item>

              </Form>


              {/*<input type="file" onChange={onChange} />*/}
              {/*<button*/}
              {/*onClick={async () => {*/}
              {/*const result: any = await Storage.get(*/}
              {/*'themeforest-FDOqFOb1-affordable-supermarket-shopify-os-20-theme.zip',*/}
              {/*{*/}
              {/*download: true,*/}
              {/*}*/}
              {/*);*/}
              {/*downloadBlob(result.Body, 'themeforest-FDOqFOb1-affordable-supermarket-shopify-os-20-theme.zip');*/}
              {/*}}*/}
              {/*>*/}
              {/*download*/}
              {/*</button>*/}
            </div>

          </Col>

          <Col className="gutter-row" xs={0} sm={0} md={0} lg={0} xl={1} xxl={1}/>

          <Col className="gutter-row" xs={24} sm={24} md={24} lg={8} xl={6} xxl={6}>
            <Form
              form={form}
              name="form-create-user"
              onFinish={onCreateJob}
              onValuesChange={() => onValuesChange()}
              autoComplete="off"
              layout="vertical"
            >

              <Form.Item
                label="Select Customer"
                name="customerId"
                hidden={loginUser.roles.includes(RoleConst.CUSTOMER)}
              >
                <SelectOption
                  data={listCustomerOption}
                  disabled={loginUser.roles.includes(RoleConst.CUSTOMER)}
                />
              </Form.Item>

              <Form.Item
                label="Job Status"
                name="status"
              >
                <SelectOption
                  data={JobStatusOptions}
                  disabled
                />
              </Form.Item>

              <Form.Item
                label="Assign Staff"
                hidden={loginUser.roles.includes(RoleConst.CUSTOMER)}
              >
                <SelectConfirm
                  confirmMessage="Do you want to assign this job to staff %%NAME%%"
                  data={listStaffOption}
                  value={selectedStaffID}
                  onConfirm={(e) => {
                    confirmChangeAssignStaff(e)
                  }}
                  style={{width: '100%'}}
                />
              </Form.Item>

              <Form.Item
                label="Assign QC"
                hidden={loginUser.roles.includes(RoleConst.CUSTOMER)}
              >
                <SelectConfirm
                  confirmMessage="Do you want to assign this job to QC %%NAME%%"
                  data={listQcOption}
                  value={selectedQcID}
                  onConfirm={(e) => {
                    setSelectedQcID(e)
                  }}
                  style={{width: '100%'}}
                />
              </Form.Item>

              <Form.Item className="form-buttons" wrapperCol={{span: 24}}>
                <Button
                  type="primary"
                  loading={loadingCreateJob}
                  htmlType="submit">
                  Create a New Job
                </Button>

                <Link to={RouteConst.JOB_LIST}>
                  <Button type="default">Cancel</Button>
                </Link>
              </Form.Item>

            </Form>
          </Col>


        </Row>

      </div>
    </>
  );
};

export default CreateJob;
