import React, { useEffect, useState } from 'react';
import {PageHeader, Row, Col, Button, Modal, Form, Input, Typography, Tooltip, Table, InputNumber} from "antd";
import './styles.scss';
import {jobTypeCodeRegex} from "../../constants/variable";
import {EditOutlined, QuestionCircleTwoTone} from '@ant-design/icons';
import {useAppDispatch} from "../../core/app.store";
import {createJobType, deleteJobType, getAllJobType, updateJobType} from "../../core/jobType/effects";
import {convertCurrency, hasPermission, showNofi} from "../../utils";
import {useSelector} from "react-redux";
import {getJobTypeByIdSelector, getJobTypeListSelector} from '../../core/jobType/selectors';
import _ from "lodash";
import {TablePaginationConfig} from "antd/lib/table";
import DeleteConfirmPopover from "../../components/DeleteConfirmPopover";
import {JobTypeItemResponse} from "../../core/jobType/models";
import {permissions} from "../../routes/config/Permissions";
import HasPermissions from '../../hoc/HasPermissions';
import {NOT_HAVE_PERMISSION_MESSAGE} from "../../constants";

const { Paragraph, Title } = Typography;

function JobTypeManage () {

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const {data, pagination: tablePagination, isLoading: loadingGetJobType} = useSelector(getJobTypeListSelector);
  const {data: jobTypeById} = useSelector(getJobTypeByIdSelector);

  const [screenPagination, setScreenPagination] = useState({
    pageNumber: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [editJobType, setEditJobType] = useState<any>({});

  useEffect(() => {
    getJobType();
    return () => {
      console.log('******************* UNMOUNTED');
    };
  }, []);



  const getJobType = (params?: any) => {
    const values = {
      ...screenPagination,
      pageNumber: 1,
      ...params,
    };
    dispatch(getAllJobType(values))
  };


  const onTableChange = (pagination: TablePaginationConfig, filters, sorter) => {
    const values = {
      ...pagination,
      ...filters,
      ...{ pageNumber: pagination.current },
      // ...{ sortBy: sorter.column ? sorter.columnKey : '', sortDirection: sorter.order === 'ascend' ? 'asc' : 'desc' },
      ...{ sort: [sorter.column ? sorter.columnKey : '', sorter.order === 'ascend' ? 'asc' : 'desc'] },
    };
    setScreenPagination({ ...screenPagination, ...values });
    getJobType(values);
  };

  const onSaveJobType = async(data) => {

    setLoadingSave(true);

    const payload = {
      ...data,
      code: data.code.toUpperCase()
    };

    if (_.isEmpty(editJobType)){
      const resultCreate = await dispatch(createJobType(payload));
      if (createJobType.fulfilled.match(resultCreate)){
        showNofi('success', 'Job Type has been created successfully.');
        getJobType();
      } else {
        showNofi('error', 'Job type created fail.');
      }
    } else {
      const resultUpdate = await dispatch(updateJobType({...payload, id: editJobType.id}));
      if (updateJobType.fulfilled.match(resultUpdate)){
        showNofi('success', 'Job type has been updated successfully.');
        getJobType();
      } else {
        showNofi('error', 'Job type updated fail.');
      }
    }

    setLoadingSave(false);
    form.resetFields();
    hideModal();
  };


  const showModal = () => {
    setIsModalVisible(true);
  };
  const hideModal = () => {
    setIsModalVisible(false);
  };


  const onDeleteJobType = async (record) => {

    if (!hasPermission([permissions.DELETE_JOB_TYPE])) {
      showNofi('warn', NOT_HAVE_PERMISSION_MESSAGE);
      return;
    }

    const resultDel = await dispatch(deleteJobType(record.id));
    if (deleteJobType.fulfilled.match(resultDel)){
      showNofi('success', 'Job type has been deleted.');
      getJobType();
    } else {
      showNofi('error', 'Job type deleted fail.');
    }

  };


  const onEditJobType = (record) => {

    if (!hasPermission([permissions.UPDATE_JOB_TYPE])) {
      showNofi('warn', NOT_HAVE_PERMISSION_MESSAGE);
      return;
    }

    form.setFieldsValue(record);
    setEditJobType(record);
    showModal();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      className: 'col-Id alignCenter',
      key: 'id',
      sorter: true,
    },
    {
      title: 'Code',
      dataIndex: 'code',
      className: 'col-Code',
      key: 'code',
      sorter: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      className: 'col-Name',
      key: 'name',
      sorter: true,
    },
    hasPermission([permissions.UPDATE_JOB_TYPE]) ?
    {
      title: 'Action',
      dataIndex: 'action',
      className: 'col-action alignCenter',
      // fixed: 'right',
      render: (text, record: JobTypeItemResponse) => {
        return (
          <div className="actionUserList">

            <HasPermissions permissions={[permissions.UPDATE_JOB_TYPE]}>
            <Tooltip title="Edit">
                <Button type="link"
                        onClick={() => onEditJobType(record)}
                        icon={<EditOutlined />} />
            </Tooltip>
            </HasPermissions>

            <HasPermissions permissions={[permissions.DELETE_JOB_TYPE]}>
            <DeleteConfirmPopover
              text={<>Do you want to delete job type &nbsp; <b>{record.name}</b>?</>}
              onClick={() => onDeleteJobType(record)}
            />
            </HasPermissions>
          </div>
        )
      },
    } : {},
  ];


  const onAddNewJobType = () => {
    setEditJobType({});
    form.resetFields();
    showModal();
  };


  const onChange = (value: number | any) => {
    console.log('changed', value);
  };


  return (
    <>
      <div className="jobTypeManage">
        <PageHeader title="Job Type Manage" />

        <div className="btnFieldAddNew">
          <HasPermissions permissions={[permissions.CREATE_JOB_TYPE]}>
          <Button type="primary" onClick={onAddNewJobType}>
            Add New JobType
          </Button>
          </HasPermissions>
        </div>


        <div className="tableListJobType">
          <Table
            dataSource={data}
            columns={columns.filter(item => !_.isEmpty(item))}
            rowKey={record => record.id}
            loading={loadingGetJobType}
            pagination={{ ...screenPagination, ...tablePagination, position: ['bottomRight'] }}
            onChange={onTableChange}
            className={`user-table   ${_.isEmpty(data) ? 'no-datas' : ''}`}
            // ${data.length === 0 ? 'no-datas' : ''}
            locale={{
              emptyText: 'There are no Job Type',
              cancelSort: '',
            }}
          />

        </div>


      </div>

      <Modal
        title={`${_.isEmpty(editJobType) ? 'Add New Job Type' : `Edit Job Type:  ${editJobType.name}`}`}
        footer={null}
        closable={false}
        width={500}
        wrapClassName="modalJobType"
        open={isModalVisible}
      >
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          colon={false}
          labelAlign="left"
          name="savePaymentMethod"
          onFinish={onSaveJobType}
        >
          <Form.Item
            label="Job Type Name"
            name="name"
            rules={[{ required: true, whitespace: true, message: 'This field is required!' }]}
          >
            <Input />
          </Form.Item>

            <Form.Item
              label={
                <>
                  Job Type Code &nbsp;&nbsp;
                  <Tooltip title="Job Type Code must be uppercase and 4-6 character">
                    <QuestionCircleTwoTone />
                  </Tooltip>
                </>
              }
              name="code"
              rules={[
                { required: true, whitespace: true, message: 'This field is required!' },
                {
                  validator(rule, value) {
                    if (!value) {
                      return Promise.resolve();
                    }

                    if (!value.match(jobTypeCodeRegex)) {
                      return Promise.reject('Job Type Code must be uppercase and 4-6 character');
                    }

                    return Promise.resolve();

                  },
                },
                ]}
            >
              <Input style={{ textTransform: 'uppercase' }} />
            </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }} className="formBtnGroup">
            <Button
              type="primary"
              className="btnSave"
              loading={loadingSave}
              // disabled={loadingSave}
              htmlType="submit"
            >
              Save
            </Button>
            <Button type="default" disabled={loadingSave} onClick={hideModal}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>


    </>

  );
};



export default JobTypeManage;