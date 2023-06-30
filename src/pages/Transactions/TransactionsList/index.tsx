import React, {useEffect, useState} from "react";
import {Button, Col, DatePicker, Form, Image, Input, PageHeader, Row, Table, Tooltip} from "antd";
import './style.scss';
import {useAppDispatch} from "../../../core/app.store";
import {getListTransactionAct} from "../../../core/transactions/effects";
import {TablePaginationConfig} from "antd/lib/table";
import _ from "lodash";
import {useSelector} from "react-redux";
import {
  getListTransactionSelector,
  getStateLoadingTransactionList, getStateTotalTransactions,
  getTransactionListPagination
} from "../../../core/transactions/selectors";
import {ColumnsType} from "antd/es/table";
import {convertCurrency, deleteNullProp, formatNumberVNI, hasPermission, numberWithCommas} from "../../../utils";
import {GetTransactionResponse} from "../../../core/transactions/models";
import moment from 'moment';
import {DateFormatFull, RoleConst} from "../../../constants";
import {permissions} from "../../../routes/config/Permissions";
import {Link} from "react-router-dom";
import * as RouteConst from "../../../constants/RouteConst";
import {EyeTwoTone} from "@ant-design/icons/lib";
import {getLoginUserSelector} from "../../../core/admin/selectors";
import {getStaffListAct} from "../../../core/user/effects";
import {getAllStaffOption} from "../../../core/user/selectors";
import SelectOption from "../../../components/SelectOption";

function TransactionsList (){

  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const loginUser = useSelector(getLoginUserSelector);
  const transactionList = useSelector(getListTransactionSelector);
  const totalTransactions = useSelector(getStateTotalTransactions);
  const transactionListPagination = useSelector(getTransactionListPagination);
  const loadingGetListTransaction = useSelector(getStateLoadingTransactionList);
  const listStaff = useSelector(getAllStaffOption);



  const [screenPagination, setScreenPagination] = useState({
    pageNumber: 1,
    pageSize: 20,
    showSizeChanger: true,
    pageSizeOptions: [10,30,50],
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
  });



  useEffect(() => {
    form.setFieldValue('month', moment());
    getTransactionList();
    dispatch(getStaffListAct({}));
    // getFirstAndLastDateMonth(new Date())
  }, []);

  const getTransactionList = (params?: any) => {

    const screenPaginationClone = {
      page: screenPagination.pageNumber,
      size: screenPagination.pageSize
    };

    const fromToDateFormat = 'yyyy-MM-DD HH:mm:ss';

    const formVal = form.getFieldsValue();
    const paramsForm = {
      month: formVal.month ? moment(new Date(formVal.month)).format('yyyyMM') :  moment(new Date()).format('yyyyMM'),
      startDate: formVal.startDate ? moment(new Date(formVal.startDate)).startOf('day').format(fromToDateFormat) : null,
      endDate: formVal.endDate ? moment(new Date(formVal.endDate)).endOf('day').format(fromToDateFormat) : null,
      staffs: formVal?.staffs
    };

    const values = {
      ...screenPaginationClone,
      // ...params,
      ...paramsForm,
    };

    dispatch(getListTransactionAct(deleteNullProp(values)));
  };

  const onTableChange = (pagination: TablePaginationConfig, filters, sorter) => {
    const sorts = sorter.column ? [sorter.columnKey, sorter.order === 'ascend' ? 'asc' : 'desc'] : [];
    const values = {
      // ...pagination,
      ...filters,
      ...{pageNumber: pagination.current, pageSize: pagination.pageSize},
      sorts,
      // ...{
      //   sortBy: sorter.column ? sorter.columnKey : '',
      //   sortDirection: sorter.order === 'ascend' ? 'asc' : 'desc'
      // },
    };
    console.log({pageNumber: pagination.current, pageSize: pagination.pageSize})
    setScreenPagination({...screenPagination, ...values});
    getTransactionList(values);
  };


  const columns: ColumnsType<GetTransactionResponse> = [
    {
      title: 'No.',
      key: 'index',
      render:(text, record, index) => index + 1,
      width: 40,
      align: 'center',
    },
    {
      title: 'Date Created',
      dataIndex: 'createdAt',
      className: 'col-createdAt',
      key: 'createdAt',
      width: 80,
      sorter: true,
      render: (text, record: GetTransactionResponse) => {
        return (
          <>
            {moment(record.createdAt).format(DateFormatFull)}
          </>
        )
      }
    },
    {
      title: 'Job Name',
      dataIndex: 'jobName',
      className: 'col-assign',
      key: 'jobName',
      width: 160,
      sorter: true,
      render: (text, record: GetTransactionResponse) => {
        return (
          <>{record?.jobName}</>
        )
      }
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      className: 'col-amount',
      key: 'amount',
      width: 110,
      align: 'center',
      render: (text, record: GetTransactionResponse) => {
        return (
          <>{formatNumberVNI(record?.jobPrice)} đ</>
        )
      }
    },
    {
      title: 'Staff',
      dataIndex: 'staffName',
      className: 'col-staffName',
      key: 'staffName',
      width: 130,
    },
    {
      title: 'QC',
      dataIndex: 'qcName',
      className: 'col-qcName',
      key: 'qcName',
      width: 130,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      className: 'col-description',
      key: 'description',
      width: 250,
    },
    !loginUser.roles.includes(RoleConst.CUSTOMER) ?
      {
        title: 'Action',
        dataIndex: 'action',
        className: 'col-action alignCenter',
        width: 80,
        fixed: 'right',
        key: 'action',
        render: (text, record: GetTransactionResponse) => {
          let urlDetailJob = '';
          if (hasPermission([permissions.UPDATE_JOB])){
            urlDetailJob = RouteConst.JOB_DETAIL.replace(':id', `${record.jobId}`);
          } else if (hasPermission([permissions.VIEW_JOB])){
            urlDetailJob = RouteConst.VIEW_JOB.replace(':id', `${record.jobId}`);
          }
          return (
            <div className="actionUserList">
              {urlDetailJob &&
              <Tooltip title="View Details Job">
                <Link to={urlDetailJob}>
                  <Button type="link" icon={<EyeTwoTone/>}/>
                </Link>
              </Tooltip>
              }
            </div>
          )
        },
      } : {},
  ];

  const onChangeDatePicker = (date, dateString) => {
    form.resetFields(['startDate', 'endDate']);
    getTransactionList()
  };

  const onChangeStartEndDate = (date, dateString) => {
    getTransactionList()
  };


  function disabledDateStartDate(current) {
    // Lấy ngày đầu tiên của tháng hiện tại

    const selectedMonth = form.getFieldValue('month') ? moment(form.getFieldValue('month')) : moment();
    const today = moment();
    const firstDayOfMonth = moment(selectedMonth).startOf('month');
    const lastDayOfMonth = moment(selectedMonth).endOf('month');
    const endDate = form.getFieldValue('endDate');

    const isCurMonth = selectedMonth.isSame(moment(), 'month');

    const lastDate = isCurMonth ? (endDate && endDate < today ? endDate : today) : (endDate && endDate < lastDayOfMonth ? endDate : lastDayOfMonth);

    // Nếu ngày đang xét trước ngày đầu tiên của tháng hoặc sau ngày cuối cùng của tháng
    if (current && (current < firstDayOfMonth || current > lastDate)){
      return true;
    }

    return false; // Enable ngày này
  }


  function disabledEndDate(current) {
    // Lấy ngày đầu tiên của tháng hiện tại
    const selectedMonth = form.getFieldValue('month') ? moment(form.getFieldValue('month')) : moment();
    const firstDayOfMonth = moment(selectedMonth).startOf('month');
    const lastDayOfMonth = moment(selectedMonth).endOf('month');
    const startDate = form.getFieldValue('startDate');
    const isCurMonth = selectedMonth.isSame(moment(), 'month');

    const firstDate = startDate && startDate > firstDayOfMonth ? startDate : firstDayOfMonth;
    const lastDate = isCurMonth && moment() < lastDayOfMonth ? moment() : lastDayOfMonth;

    // Nếu ngày đang xét trước ngày đầu tiên của tháng hoặc sau ngày cuối cùng của tháng
    if (current && (current < firstDate || current > lastDate)) {
      return true; // Disable ngày này
    }

    return false; // Enable ngày này
  }



  return (
    <div className="pageTransactionsList">

      <PageHeader
        title="Transactions"
        extra={
          <>
            <span className="totalTransaction">{formatNumberVNI(totalTransactions)} đ</span>
          </>
        }
      />

      <Form
        form={form}
        name="search-forms"
        onFinish={getTransactionList}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Row gutter={10}>

          <Col span={12} md={3}>
            <Form.Item
              name="month"
              label="Select month"
            >
              <DatePicker
                onChange={onChangeDatePicker}
                format={'MM-yyyy'}
                allowClear={false}
                style={{width: '100%'}}
                picker="month" />
            </Form.Item>
          </Col>

          <Col span={12} md={6}>
            <Form.Item
              name="jobId"
              label="Job title/ Job ID"
            >
              <Input />
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

          {[RoleConst.ADMIN].some(item => loginUser.roles.includes(item)) &&
            <Col span={12} md={4}>
              <Form.Item
                name="staffs"
                label="Staffs"
              >
                <SelectOption
                  data={listStaff}
                  onChange={getTransactionList}
                  mode="multiple"
                  maxTagCount="responsive"
                  showArrow
                  style={{width: '100%'}}
                />
              </Form.Item>
            </Col>
          }


          <Col span={12} md={2}>
            <Form.Item
              label="&nbsp;"
            >
            <Button
              type="primary"
              htmlType="submit">
              Search
            </Button>
            </Form.Item>
          </Col>

        </Row>
      </Form>

      <div>
        <Table
          dataSource={transactionList}
          columns={columns.filter(item => !_.isEmpty(item))}
          rowKey={record => record.id}
          loading={loadingGetListTransaction}
          pagination={{...screenPagination, ...transactionListPagination, position: ['topRight', 'bottomRight']}}
          onChange={onTableChange}
          className={`transaction-table   ${_.isEmpty(transactionList) ? 'no-datas' : ''}`}
          // ${data.length === 0 ? 'no-datas' : ''}
          // scroll={{x: '1200px', y: 'calc(100vh - 490px)'}}
          scroll={{x: '1200px'}}
          locale={{
            emptyText: 'There are no transaction',
            cancelSort: '',
          }}
        />
      </div>
    </div>
  )
}


export default TransactionsList;