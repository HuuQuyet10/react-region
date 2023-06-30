import {useParams} from "react-router";
import {useAppDispatch} from "../../../core/app.store";
import {Button, Col, DatePicker, Form, Input, InputNumber, Modal, PageHeader, Row, Select, Tooltip} from "antd";
import {useEffect, useState} from "react";
import { getJobById, updateJobAct, updateJobAssignQcAct, updateJobAssignStaffAct, updateStatusJobAct} from "../../../core/jobManage/effects";
import {useSelector} from "react-redux";
import {getDetailJobByIdSelector} from "../../../core/jobManage/selectors";
import {ReactQuillEditorFormats, ReactQuillModules} from "../../../constants/editorSettings";
import {UserStatus} from "../../../core/jobType/models";
import {CalendarOutlined, MinusCircleOutlined, PlusOutlined, QuestionCircleTwoTone} from "@ant-design/icons/lib";
import {JobStatusOptions, JobStatusValue} from "../../../constants/options";
import {Link} from "react-router-dom";
import RouteConst, {DateFormatFull, NOT_HAVE_PERMISSION_MESSAGE, RoleConst} from "../../../constants";
import React from "react";
import ReactQuill, { Quill } from 'react-quill';
import ReactRouterPause from '@allpro/react-router-pause';
import CustomUpload from "../../../components/CustomUpload";
import CustomFileDownload from "../../../components/CustomFileDownload";
import moment, { Moment } from 'moment';
import SelectOption from "../../../components/SelectOption";
import SelectConfirm from "../../../components/SelectConfirm";
import {getAllCustomerOption, getAllQCOption, getAllStaffOption} from "../../../core/user/selectors";
import {getJobTypeListOption} from "../../../core/jobType/selectors";
import _ from "lodash";
import ScrollToTop from "../../../components/ScrollToTop";
import {getCustomerListAct, getQcListAct, getStaffListAct, getUserList} from "../../../core/user/effects";
import {getAllJobType} from "../../../core/jobType/effects";
import {getUsernameFromId, hasPermission, showNofi} from "../../../utils";
import {GetDetailJobResponse} from "../../../core/jobManage/models";
import {clearDataJobDetail} from "../../../core/jobManage/job.slice";
import './style.scss';
import {permissions} from "../../../routes/config/Permissions";
import HasPermissions from "../../../hoc/HasPermissions";
import {getLoginUserSelector} from "../../../core/admin/selectors";
import {disabledDateTime} from "../../../utils/dateUtils";

const {Option} = Select;

const UpdateJob = () => {

  const {id} = useParams() as { id: string | number };
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const loginUser = useSelector(getLoginUserSelector);


  const detailJob: GetDetailJobResponse = useSelector(getDetailJobByIdSelector);
  const jobTypeListOption = useSelector(getJobTypeListOption);
  const listStaffOption = useSelector(getAllStaffOption);
  const listQcOption = useSelector(getAllQCOption);
  const listCustomerOption = useSelector(getAllCustomerOption);

  const [loadingUpdateJob, setLoadingUpdateJob] = useState(false);
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [fileList, setFileList] = useState<string[]>([]);
  const [selectedStaffID, setSelectedStaffID] = useState<number>();
  const [selectedQcID, setSelectedQcID] = useState<number>();
  const [jobStatus, setJobStatus] = useState<string>('');


  useEffect(() => {
    return () => {
      dispatch(clearDataJobDetail()); // clear data detail job khi unmount component
    };
  }, []);

  useEffect(() => {
    if (id) {
      getDetailJob(id);
      getUserListForOption();
      getAllJobTypeForOption();
    }
  }, [id]);

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

  const getDetailJob = (id) => {
    dispatch(getJobById(id));
  };

  useEffect(() => {
    if (!_.isEmpty(detailJob)) {
      patchFormValue(detailJob);
      setFormIsDirty(false);
    }
  }, [detailJob]);



  const patchFormValue = (detailJob: GetDetailJobResponse) => {
    form.setFieldsValue({
      ...detailJob,
      deadline: detailJob.deadline ? moment(detailJob.deadline) : null,
    });
    if (detailJob.attachment){
      setFileList([detailJob.attachment]);
    }
    setSelectedStaffID(detailJob.staff);
    setSelectedQcID(detailJob.qc);
    setJobStatus(detailJob.status);
  };


  const onUpdateJob = async data => {

      if (!hasPermission([permissions.UPDATE_JOB])){
          showNofi('warn', NOT_HAVE_PERMISSION_MESSAGE);
          return;
      }

    setLoadingUpdateJob(true);

    const deadline: Moment = data.deadline?.format('YYYY-MM-DD HH:mm:ss') || null;

    const values = {
      ...data,
      id,
      deadline: deadline,
      attachment: !_.isEmpty(fileList) ? fileList[0] : '',
      qc: selectedQcID,
      staff: selectedStaffID,
    };

    const resultUpdate = await dispatch(updateJobAct(values));
    if (updateJobAct.fulfilled.match(resultUpdate)) {
      showNofi('success', 'Update job has been successfully.');
      setFormIsDirty(false);
    } else {
      showNofi('error', 'Update job fail.');
    }
    setLoadingUpdateJob(false)
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

  const onUploadComplete = (urlDownload: string) => {
    if(urlDownload){
      setFileList([urlDownload]);
      // setFileUpload(urlDownload);
    }
  };


  const confirmChangeJobStatus = async (status: string) => {


      if (!hasPermission([permissions.UPDATE_STATUS_JOB])){
          showNofi('warn', NOT_HAVE_PERMISSION_MESSAGE);
          return;
      }

    form.validateFields().then( async (values) => {
      const resultUpdateStatus: any = await dispatch(updateStatusJobAct({id, jobStatus: status}));

      if (updateStatusJobAct.fulfilled.match(resultUpdateStatus)) {
        showNofi('success', 'Job status has been updated successfully!');
        setJobStatus(status);
      } else {
        showNofi('error', resultUpdateStatus?.payload?.message || 'Job status updated fail.');
      }
    })
      .catch((errorInfo) => {
        showNofi('error', 'Vui lòng chọn job type.');
      });


  };


    const confirmChangeAssignQC = async (qcUserId) => {
        if (!hasPermission([permissions.ASSIGN_QC_JOB])){
            showNofi('warn', NOT_HAVE_PERMISSION_MESSAGE);
            return;
        }

        const resultUpdateQC: any = await dispatch(updateJobAssignQcAct({jobId: id, userId: qcUserId}));
        if (updateJobAssignQcAct.fulfilled.match(resultUpdateQC)) {
            showNofi('success', `${detailJob.name} has been assign to ${getUsernameFromId(qcUserId, listQcOption)}`);
            setSelectedQcID(qcUserId);
        } else {
            showNofi('error', resultUpdateQC?.payload?.message || 'Job assigned fail');
        }
    };


    const confirmChangeAssignStaff = async (staffUserId) => {
        // if (!hasPermission([permissions.ASSIGN_STAFF_JOB])){
        if (!hasPermission([permissions.ASSIGN_STAFF_JOB])){
            showNofi('warn', NOT_HAVE_PERMISSION_MESSAGE);
            return;
        }

        const resultUpdateStaff: any = await dispatch(updateJobAssignStaffAct({jobId: id, userId: staffUserId}));
        if (updateJobAssignStaffAct.fulfilled.match(resultUpdateStaff)) {
            showNofi('success', `${detailJob.name} has been assign to ${getUsernameFromId(staffUserId, listStaffOption)}`);
            setSelectedStaffID(staffUserId);
        } else {
            showNofi('error', resultUpdateStaff?.payload?.message || 'Job assigned fail');
        }
    };



    const onApiSearch = (key) => {
      console.log('key', key)
    };


  return (
    <div className="updateJobPage">
      <ScrollToTop />
      <ReactRouterPause handler={handleNavigation} when={formIsDirty} />

      <Row gutter={16}>
        <Col className="gutter-row" span={24}>
          <div className="pageHeading">
            <PageHeader
              title="Update Job"
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
              name="form-update-job"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 24 }}
              labelAlign="left"
              onFinish={onUpdateJob}
              onValuesChange={() => onValuesChange()}
              autoComplete="off"
              colon={false}
            >
              <Form.Item
                label="Title Job"
                name="name"
                rules={[{ required: true, message: 'This field is required!' }]}
              >
                <Input
                  disabled={!(hasPermission([permissions.UPDATE_JOB]) && detailJob?.status != JobStatusValue.COMPLETED)}
                />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'This field is required!' }]}
              >
                {/*<TextArea rows={10} />*/}
                <ReactQuill
                  theme={'snow'}
                  // onChange={this.handleChange}
                  // value={this.state.editorHtml}
                  modules={ReactQuillModules}
                  formats={ReactQuillEditorFormats}
                  className="qillEditor"
                  readOnly={!(hasPermission([permissions.UPDATE_JOB]) && detailJob?.status != JobStatusValue.COMPLETED)}
                  // bounds={'.app'}
                  // placeholder={this.props.placeholder}
                />
              </Form.Item>


              <Form.Item
                label="Job types"
                rules={[{ required: true}]}>
                <Form.List name="items"
                  // rules={[{ validator: (_, value) => {
                  //     if (!value || value.length === 0) {
                  //       return Promise.reject('This field is required');
                  //     }
                  //     return Promise.resolve();
                  //   } }]}
                >
                  {(fields, { add, remove }) => (
                    <React.Fragment>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row gutter={16} key={key}>
                          <Col className="gutter-row" xs={12} xl={10}>
                            <Form.Item
                              {...restField}
                              name={[name, 'jobTypeId']}
                              rules={[{ required: true, message: 'Job type is required!' }]}
                            >
                              <SelectOption
                                data={jobTypeListOption}
                                showSearch={true}
                                onLoadmore={(keyword) => {console.log('key search',keyword )}}
                                disabled={!(hasPermission([permissions.UPDATE_JOB]) && detailJob?.status != JobStatusValue.COMPLETED)}
                              />
                            </Form.Item>
                          </Col>

                          <Col className="gutter-row" xs={8} xl={5}>
                            <Form.Item
                              {...restField}
                              name={[name, 'quantity']}
                              rules={[{ required: true, message: 'Quantity is required!'}]}
                            >
                              <InputNumber
                                addonAfter={'ảnh'}
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                disabled={!(hasPermission([permissions.UPDATE_JOB]) && detailJob?.status != JobStatusValue.COMPLETED)}
                              />
                            </Form.Item>
                          </Col>

                          <Col className="gutter-row" xs={1}>
                            {!!(hasPermission([permissions.UPDATE_JOB]) && detailJob?.status != JobStatusValue.COMPLETED) &&
                              <MinusCircleOutlined style={{top: '3px', position: 'relative'}} onClick={() => remove(name)} />
                            }

                          </Col>
                        </Row>
                      ))}

                      {!!(hasPermission([permissions.UPDATE_JOB]) && detailJob?.status != JobStatusValue.COMPLETED) &&
                      <Form.Item>
                        <Row gutter={16}>
                          <Col xs={12} xl={10}>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Add Job Type
                            </Button>
                          </Col>
                        </Row>
                      </Form.Item>
                      }

                    </React.Fragment>
                  )}
                </Form.List>
              </Form.Item>

              <Form.Item
                label="Deadline"
                name="deadline"
                rules={[
                  { required: true, message: 'This field is required!' },
                  // {validator(rule, value) {
                  //     if (!value) {
                  //       return Promise.resolve();
                  //     }
                  //     if (value < moment()) {
                  //       return Promise.reject('Deadline is not valid!');
                  //     }
                  //     return Promise.resolve();
                  //   }
                  // },
                  ]}>
                <DatePicker
                  suffixIcon={<CalendarOutlined />}
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
                  disabled={!(hasPermission([permissions.UPDATE_JOB]) && detailJob?.status != JobStatusValue.COMPLETED)}
                />
              </Form.Item>

              <HasPermissions permissions={[permissions.UPDATE_JOB]}>
                <Form.Item label="Upload">
                  <CustomUpload onComplete={(fileName) => onUploadComplete(fileName)}
                                disabled={!(hasPermission([permissions.UPDATE_JOB]) && detailJob?.status != JobStatusValue.COMPLETED)}
                  />
                </Form.Item>
              </HasPermissions>

              <Form.Item label={' '} colon={false}>
                <CustomFileDownload urlsDownload={fileList} />
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

        <Col className="gutter-row" xs={0} sm={0} md={0} lg={0} xl={1} xxl={1} />

        <Col className="gutter-row" xs={24} sm={24} md={24} lg={8} xl={6} xxl={6}>
          <Form
            form={form}
            name="form-update-job"
            onFinish={onUpdateJob}
            onValuesChange={() => onValuesChange()}
            autoComplete="off"
            layout="vertical"
          >

            <Form.Item
              label="Select Customer"
              name="customerId"
              // hidden={!loginUser.roles.includes(RoleConst.ADMIN)}
              hidden={!hasPermission([permissions.FIND_CUSTOMER])}
            >
              <SelectOption
                data={listCustomerOption}
                // disabled={!hasPermission([permissions.FIND_CUSTOMER])} // nếu dã có customer id thì nghĩa là đã chọn khách hàng cho job nên cần disable
                disabled={!(hasPermission([permissions.UPDATE_JOB]) && hasPermission([permissions.FIND_CUSTOMER]) && detailJob?.status != JobStatusValue.COMPLETED)}
              />
            </Form.Item>

            <Form.Item
              label="Job Status"
            >
              <SelectConfirm
                confirmMessage="Do you want to change job status to %%NAME%%"
                data={JobStatusOptions}
                value={jobStatus}
                // disabled={!hasPermission([permissions.UPDATE_STATUS_JOB])}
                disabled={!(hasPermission([permissions.UPDATE_JOB]) && hasPermission([permissions.UPDATE_STATUS_JOB]) && detailJob?.status != JobStatusValue.COMPLETED)}
                onConfirm={(e)=>{confirmChangeJobStatus(e)}}
                style={{width: '100%'}}
                disabledStatus={JobStatusOptions.find(item => item.value == jobStatus)?.disableValue}
              />
            </Form.Item>

            <Form.Item
              label="Assign Staff"
            >
              <SelectConfirm
                confirmMessage="Do you want to assign this job to staff %%NAME%%"
                data={listStaffOption}
                value={selectedStaffID}
                // disabled={!hasPermission([permissions.ASSIGN_STAFF_JOB])}
                disabled={!(hasPermission([permissions.UPDATE_JOB]) && hasPermission([permissions.ASSIGN_STAFF_JOB]) && detailJob?.status != JobStatusValue.COMPLETED)}
                onConfirm={(e)=>{confirmChangeAssignStaff(e)}}

                style={{width: '100%'}}
              />
            </Form.Item>

            <Form.Item
              label="Assign QC"
            >
              <SelectConfirm
                confirmMessage="Do you want to assign this job to QC %%NAME%%"
                // disabled={!hasPermission([permissions.ASSIGN_QC_JOB])}
                disabled={!(hasPermission([permissions.UPDATE_JOB]) && hasPermission([permissions.ASSIGN_QC_JOB]) && detailJob?.status != JobStatusValue.COMPLETED)}
                data={listQcOption}
                value={selectedQcID}
                onConfirm={(e)=>{confirmChangeAssignQC(e)}}
                style={{width: '100%'}}
              />
            </Form.Item>

            <Form.Item className="form-buttons" wrapperCol={{ span: 24 }}>
              <HasPermissions permissions={[permissions.UPDATE_JOB]}>
                <Button
                  type="primary"
                  loading={loadingUpdateJob}
                  disabled={!formIsDirty}
                  htmlType="submit">
                  Update Job
                </Button>
              </HasPermissions>

              <Link to={RouteConst.JOB_LIST}>
                <Button type="default">
                    {!hasPermission([permissions.UPDATE_JOB]) ? 'Back to job list' : 'Cancel'}
                  </Button>
              </Link>
            </Form.Item>

          </Form>
        </Col>



      </Row>

    </div>
    )

};


export default UpdateJob;