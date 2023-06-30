import React, {useEffect, useState} from "react";
import './styles.scss';
import {store, useAppDispatch} from "../../../core/app.store";
import {deleteJob, getJobList} from "../../../core/jobManage/effects";
import _ from "lodash";
import {Button, PageHeader, Table, Tooltip, Form, Row, Col, Input, DatePicker, Space} from "antd";
import {TablePaginationConfig} from "antd/lib/table";
import {useDispatch, useSelector} from "react-redux";
import {getJobListSelector} from "../../../core/jobManage/selectors";
import {DateFormatFull, localStorageKey, RoleConst} from "../../../constants";
import * as RouteConst from "../../../constants/RouteConst";
import {Link} from "react-router-dom";
import DeleteConfirmPopover from "../../../components/DeleteConfirmPopover";
import {EditOutlined, SearchOutlined} from "@ant-design/icons";
import {deleteNullProp, getUsernameFromId, hasPermission, numberWithCommas, showNofi} from "../../../utils";
import {getCustomerListAct, getQcListAct, getStaffListAct} from "../../../core/user/effects";
import {EyeTwoTone} from "@ant-design/icons/lib";
import HasPermissions from "../../../hoc/HasPermissions";
import {permissions} from "../../../routes/config/Permissions";
import {GetDetailJobResponse} from "../../../core/jobManage/models";
import {getAllCustomerOption, getAllQCOption, getAllStaffOption} from "../../../core/user/selectors";
import {ColumnsType} from "antd/es/table";
import SelectOption from "../../../components/SelectOption";
import {getJobTypeListOption} from "../../../core/jobType/selectors";
import {JobStatusOptions} from "../../../constants/options";
import {getAllJobType} from "../../../core/jobType/effects";
import './styles.scss';
import {getLoginUserSelector} from "../../../core/admin/selectors";
import moment from 'moment';
import {OptionModel} from "../../../models";
import {baseUrl} from "../../../services/urlAPI";
import {
  addReceivedMessage,
   setConnectionStatus
} from '../../../core/socket/socket.slice'
import LocalStorage from "../../../utils/LocalStorage";


const {Search} = Input;

const timeIntevalCheckOrder = 1 * 60 * 1000; // 2' in milisecond

const JobList = () => {

  const [form] = Form.useForm();
  const [formList] = Form.useForm();

  const dispatch = useDispatch();

  const loginUser = useSelector(getLoginUserSelector);
  const {data, pagination: jobPagination, isLoading: loadingGetJobs} = useSelector(getJobListSelector);
  const listStaff = useSelector(getAllStaffOption);
  const listQC = useSelector(getAllQCOption);
  const listCustomerOption = useSelector(getAllCustomerOption);
  const jobTypeListOption = useSelector(getJobTypeListOption);

  const jwToken = LocalStorage.get(localStorageKey.JWT_TOKEN, '');

  const [screenPagination, setScreenPagination] = useState({
    pageNumber: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
  });

  const [isReload, setIsReload] = useState(false)


  useEffect(() => {
    form.setFieldsValue({
      startDate: moment().startOf('month'),
      endDate: moment(),

    });
    getJobTableList();
    getUserListForOption();
    getAllJobTypeForOption();
  }, []);


  useEffect(() => {
    const parseToken = JSON.parse(jwToken);
    const socketUrl = `${baseUrl}/ws/jobs?token=${parseToken}`.replace('https', 'wss');

    const ws = new WebSocket(socketUrl);
    let connected = false;

    ws.addEventListener('open', (event: Event) => {
      console.log('ws open');
      connected = true;
      // store.dispatch(setSocketData(ws));
    });

    ws.addEventListener('message', (event: MessageEvent) => {
      console.log('ws message', event.data)
      if (!_.isEqual({message: "Connected"}, JSON.parse(event.data))) { // ở lần connect socket, BE trả ra 1 object {message: "Connected"}, nên cần phải check có isEqual ko mới set state
        setIsReload(true);
      }
      store.dispatch(addReceivedMessage(event.data));
    });

    ws.addEventListener('close', (event: CloseEvent) => {
      console.log('ws close');
      connected = false;
    });

    ws.addEventListener('error', (event: Event) => {
      console.log('ws error');
      store.dispatch(setConnectionStatus(false));
      connected = false;
    });

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (isReload) {
      getJobTableList();
      showNofi('info', 'You have been assigned new job, please check it.', 0, 'notificationNewAssign');
      setIsReload(false)
    }
  }, [isReload]);


  const getUserListForOption = () => {
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

  const getJobTableList = (params?: any) => {

    // const screenPaginationClone = {...screenPagination} as Partial<any>;
    const screenPaginationClone = {
      pageNumber: screenPagination.pageNumber,
      pageSize: screenPagination.pageSize
    };

    // delete screenPaginationClone.showSizeChanger;
    // delete screenPaginationClone.showTotal;

    const rawFormValue = form.getFieldsValue();

    const fromToDateFormat = 'yyyy-MM-DD HH:mm:ss';

    const formValue = {
      ...rawFormValue,
      startDate: rawFormValue.startDate ? moment(new Date(rawFormValue.startDate)).startOf('day').format(fromToDateFormat) : '',
      endDate: rawFormValue.endDate ? moment(new Date(rawFormValue.endDate)).endOf('day').format(fromToDateFormat) : '',
    };

    const values = {
      ...screenPaginationClone,
      pageNumber: 1,
      ...params,
      ...formValue,
    };

    dispatch(getJobList(deleteNullProp(values)));
  };

  const onTableChange = (pagination: TablePaginationConfig, filters, sorter) => {
    const sorts = sorter.column ? [sorter.columnKey, sorter.order === 'ascend' ? 'asc' : 'desc'] : [];
    const values = {
      ...pagination,
      ...filters,
      ...{pageNumber: pagination.current},
      sorts,
      // ...{
      //   sortBy: sorter.column ? sorter.columnKey : '',
      //   sortDirection: sorter.order === 'ascend' ? 'asc' : 'desc'
      // },
    };
    setScreenPagination({...screenPagination, ...values});
    getJobTableList(values);
  };


  const onDelete = async (record) => {
    const resultDelete: any = await dispatch(deleteJob(record.id));

    if (deleteJob.fulfilled.match(resultDelete)) {
      showNofi('success', 'A job has been deleted.');
      getJobTableList();
    } else {
      showNofi('error', 'There are some error when delete job.');
    }
  };


  const columns = React.useMemo<ColumnsType<any>>(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        className: 'col-Id alignCenter',
        key: 'id',
        width: 60,
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: 'Job Title',
        dataIndex: 'name',
        className: 'col-name',
        key: 'name',
        width: 220,
        sorter: true,
        render: (text, record: GetDetailJobResponse) => {
          const urlDetailJob = hasPermission([permissions.UPDATE_JOB]) ? RouteConst.JOB_DETAIL.replace(':id', record.id) : RouteConst.VIEW_JOB.replace(':id', record.id)
          return (
            <>
              <Link to={urlDetailJob}>
                {record.name}
              </Link>
            </>
          )
        }
      },
      {
        title: 'Output quantity',
        dataIndex: 'outputQuantity',
        className: 'col-assign',
        key: 'outputQuantity',
        width: 110,
        align: 'center',
        sorter: true,
        render: (text, record: GetDetailJobResponse) => {
          return (
            <>
              {/*{numberWithCommas(record?.outputQuantity)}*/}
              </>
          )
        }
      },
      {
        title: 'Deadline',
        dataIndex: 'deadline',
        className: 'col-deadline',
        key: 'deadline',
        width: 120,
        sorter: true,
        render: (text, record: GetDetailJobResponse) => {
          return (
            <>{record.deadline ? moment(record.deadline).format(DateFormatFull) : <></>}</>
          )
        }
      },
      {
        title: 'Complete Date',
        dataIndex: 'completedAt',
        className: 'col-completedAt',
        key: 'completedAt',
        width: 120,
        render: (text, record: GetDetailJobResponse) => {
          return (
            <>{record.completedAt ? moment(record.completedAt).format(DateFormatFull) : <></>}</>
          )
        }
      },
      {
        title: 'Job Type',
        dataIndex: 'typeName',
        className: 'col-job_type',
        key: 'typeName',
        width: 200,
      },
      // customer và staff ko hiện cột staff
      ![RoleConst.CUSTOMER, RoleConst.STAFF].some((item) => loginUser.roles.includes(item)) ?
        {
          title: 'Assign Staff',
          dataIndex: 'assign_staff',
          className: 'col-assign',
          key: 'assign_staff',
          width: 140,
          render: (text, record: GetDetailJobResponse) => {
            return (
              <>{getUsernameFromId(record.staff, listStaff)}</>
            )
          }
        } : {},
      // customer ko hiện cột QC
      ![RoleConst.CUSTOMER].some((item) => loginUser.roles.includes(item)) ?
        {
          title: 'Assign QC',
          dataIndex: 'assign_qc',
          className: 'col-assign',
          key: 'assign_qc',
          width: 140,
          render: (text, record: GetDetailJobResponse) => {
            return (
              <>{getUsernameFromId(record.qc, listQC)}</>
            )
          }
        } : {},
      {
        title: 'Status',
        dataIndex: 'status',
        className: 'col-status alignCenter',
        key: 'status',
        width: 150,
        sorter: true,
        render: (text, record: GetDetailJobResponse) => {
          const recordStatus = JobStatusOptions.find((item: OptionModel) => item.value == record.status);
          return (
            <>{record.status ?
              <span style={{color: recordStatus?.color}}>{recordStatus?.label}</span>
              : 'N/A'}</>
          )
        }
      },
      // chỉ hiển thị cột created by cho admin
      loginUser.roles.includes(RoleConst.ADMIN) ?
        {
          title: 'Created by',
          dataIndex: 'created_by',
          className: 'col-created_by',
          key: 'created_by',
          width: 140,
          render: (text, record: GetDetailJobResponse) => {

            return (
              <>{loginUser.roles.includes(RoleConst.ADMIN) ? record.createdUserName : ''}</>
            )
          }
        } : {},

      loginUser.roles.includes(RoleConst.ADMIN) ?
        {
          title: 'Customer',
          dataIndex: 'created_by',
          className: 'col-customer',
          key: 'customer',
          width: 140,
          render: (text, record: GetDetailJobResponse) => {

            return (
              <>{getUsernameFromId(record.customerId, listCustomerOption)}</>
            )
          }
        } : {},

      // customer thì ko cho hiển thị cột action
      !loginUser.roles.includes(RoleConst.CUSTOMER) ?
        {
          title: 'Action',
          dataIndex: 'action',
          className: 'col-action alignCenter',
          width: 130,
          fixed: 'right',
          key: 'action',
          render: (text, record: GetDetailJobResponse) => {
            return (
              <div className="actionUserList">
                <HasPermissions permissions={[permissions.UPDATE_JOB]}>
                  <Tooltip title="Edit Job">
                    <Link to={RouteConst.JOB_DETAIL.replace(':id', record.id)}>
                      <Button type="link" icon={<EditOutlined/>}/>
                    </Link>
                  </Tooltip>
                </HasPermissions>

                <HasPermissions permissions={[permissions.DELETE_JOB]}>
                  <DeleteConfirmPopover
                    title="Cancel Job"
                    text={
                      <>Do you want to delete job &nbsp; <b>{record.name}</b>?</>
                    }
                    onClick={() => onDelete(record)}
                  />
                </HasPermissions>

                <HasPermissions permissions={[permissions.VIEW_JOB]}>
                  <Tooltip title="View Details Job">
                    <Link to={RouteConst.VIEW_JOB.replace(':id', record.id)}>
                      <Button type="link" icon={<EyeTwoTone/>}/>
                    </Link>
                  </Tooltip>
                </HasPermissions>
              </div>
            )
          },
        } : {},
    ],
    [loginUser]
  );

  const onSearch = async (data) => {

    console.log('data', data)
  }

  const onClearSearch = () => {
    form.resetFields();
    getJobTableList();
  };


  function disabledDateStartDate(current) {
    // Lấy ngày đầu tiên của tháng hiện tại

    const today = moment();
    const endDate = form.getFieldValue('endDate');

    const lastDate = endDate && endDate < today ? endDate : today;

    if (current && (current > lastDate)){
      return true;
    }

    return false; // Enable ngày này
  }

  function disabledEndDate(current) {
    const startDate = form.getFieldValue('startDate');

    const firstDate = startDate;
    const lastDate = moment();

    if (current && (current < firstDate || current > lastDate)) {
      return true; // Disable ngày này
    }

    return false; // Enable ngày này
  }

  const onChangeStartEndDate = (date, dateString) => {
    getJobTableList()
  };

  return (
    <>
      <div className="tableJobList">

        <div className="pageHeading">
              <Form
                form={form}
                name="search-forms"
                onFinish={getJobTableList}
                labelCol={{span: 24}}
                wrapperCol={{span: 24}}
              >
                <PageHeader title="Job List"
                            extra={
                              <>
                                {!loginUser.roles.includes(RoleConst.ADMIN) &&
                                  <>
                                    <Button type="default" onClick={onClearSearch}>
                                      Clear Search
                                    </Button>
                                    < Button
                                      type="primary"
                                      loading={loadingGetJobs}
                                      htmlType="submit">
                                      Search
                                      </Button>
                                  </>
                                }
                              </>
                            }
                />
                <Row gutter={10}>

                  <Col span={12} md={6}>
                    <Form.Item
                      name="name"
                      label="Job title/ Job ID"
                    >
                      <Input/>
                    </Form.Item>
                  </Col>

                  <Col span={12} md={3}>
                    <Form.Item
                      name="startDate"
                      label="Start Date"
                    >
                      <DatePicker
                        onChange={onChangeStartEndDate}
                        disabledDate={disabledDateStartDate}
                        format={'DD-MM-yyyy'}
                        style={{width: '100%'}}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12} md={3}>
                    <Form.Item
                      name="endDate"
                      label="End Date"

                    >
                      <DatePicker
                        onChange={onChangeStartEndDate}
                        format={'DD-MM-yyyy'}
                        disabledDate={disabledEndDate}
                        style={{width: '100%'}}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12} md={6}>
                    <Form.Item
                      name="type"
                      label="Job Type"
                    >
                      <SelectOption
                        data={jobTypeListOption}
                        showSearch={true}
                        onChange={getJobTableList}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12} md={6}>
                    <Form.Item
                      name="status"
                      label="Job Status"
                    >
                      <SelectOption
                        data={JobStatusOptions}
                        onChange={getJobTableList}
                      />
                    </Form.Item>
                  </Col>

                  {loginUser.roles.includes(RoleConst.ADMIN) &&
                    <>
                      <Col span={12} md={6}>
                        <Form.Item
                          name="customer"
                          label="Customer"
                        >
                          <SelectOption
                            data={listCustomerOption}
                            onChange={getJobTableList}/>
                        </Form.Item>
                      </Col>

                      <Col span={12} md={6}>
                        <Form.Item
                          name="qc"
                          label="QC"
                        >
                          <SelectOption
                            data={listQC}
                            onChange={getJobTableList}/>
                        </Form.Item>
                      </Col>

                      <Col span={12} md={6}>
                        <Form.Item
                          name="staff"
                          label="Staff"
                        >
                          <SelectOption
                            data={listStaff}
                            onChange={getJobTableList}/>
                        </Form.Item>
                      </Col>


                      <Col span={12} md={6}>
                        <Form.Item label="&nbsp;" style={{textAlign: 'right'}}>
                          <Space>
                            <Button type="default" onClick={onClearSearch}>
                              Clear Search
                            </Button>

                            <Button
                              type="primary"
                              loading={loadingGetJobs}
                              htmlType="submit">
                              Search
                            </Button>
                          </Space>
                        </Form.Item>
                      </Col>

                    </>
                  }

                </Row>
              </Form>

        </div>

        <Table
          dataSource={data}
          columns={columns.filter(item => !_.isEmpty(item))}
          rowKey={record => record.id}
          loading={loadingGetJobs}
          pagination={{...screenPagination, ...jobPagination, position: ['topRight', 'bottomRight']}}
          onChange={onTableChange}
          className={`jobs-table   ${_.isEmpty(data) ? 'no-datas' : ''}`}
          // ${data.length === 0 ? 'no-datas' : ''}
          scroll={{x: '1200px'}}
          locale={{
            emptyText: 'There are no job',
            cancelSort: '',
          }}
          rowClassName={(record: GetDetailJobResponse, index) => {

            let cssStatusClass = record.status;
            if (moment() > moment(record.deadline) && !['COMPLETED', 'CANCELLED', 'COMPLETED_LATE'].includes(record.status)) {
              cssStatusClass = 'COMPLETED_LATE'
            }

            return `jobStatus ${cssStatusClass}`
          }}
        />
      </div>


    </>

  )
};


export default JobList;