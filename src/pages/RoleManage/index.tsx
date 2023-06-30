import React, {useEffect, useState} from 'react';
import {PageHeader, Row, Col, Button, Modal, Form, Input, Typography, Tooltip, Table, Select} from "antd";
import _ from "lodash";
import {useAppDispatch} from "../../core/app.store";
import {hasPermission, showNofi} from "../../utils";
import {createRole, deleteRole, getAllPermissions, getAllRole, updateRole} from "../../core/roleManage/effects";
import {CaretDownFilled, EditOutlined, EyeTwoTone, QuestionCircleTwoTone} from '@ant-design/icons';
import {roleNameRegex} from "../../constants/variable";
import {useSelector} from "react-redux";
import {getPermissionsListSelector, getRoleListSelector} from "../../core/roleManage/selectors";
import {TablePaginationConfig} from "antd/lib/table";
import DeleteConfirmPopover from "../../components/DeleteConfirmPopover";
import {deleteJobType} from "../../core/jobType/effects";
import {NOT_HAVE_PERMISSION_MESSAGE, RoleConst} from "../../constants";
import {permissions} from "../../routes/config/Permissions";
import HasPermissions from '../../hoc/HasPermissions';

const {Option} = Select;


function RoleManage() {

  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const {
    data: dataRoleList,
    // pagination: paginationRoleTable,
    isLoading: loadingGetRole
  } = useSelector(getRoleListSelector);

  const {data: permissionList} = useSelector(getPermissionsListSelector);

  const [screenPagination, setScreenPagination] = useState({
    pageNumber: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [editRole, setEditRole] = useState<any>({});


  useEffect(() => {
    getRoles();
    dispatch(getAllPermissions());
    return () => {
      console.log('un-mount role list');
    };
  }, []);

  const onAddNewRole = () => {
    setEditRole({});
    form.resetFields();

    if (!hasPermission([permissions.CREATE_ROLE])) {
      showNofi('warn', NOT_HAVE_PERMISSION_MESSAGE);
      return;
    }

    showModal();
  };


  const getRoles = (params?: any) => {
    const values = {
      ...screenPagination,
      pageNumber: 1,
      ...params,
    };
    dispatch(getAllRole(values))
  };

  const onSaveRole = async (data) => {

    if (!hasPermission([permissions.UPDATE_ROLE])) {
      showNofi('warn', NOT_HAVE_PERMISSION_MESSAGE);
      return;
    }

    if (editRole.id == RoleConst.ADMIN) {
      showNofi('warn', 'Role admin can not update');
      return;
    }

    setLoadingSave(true);

    if (_.isEmpty(editRole)) {
      const resultCreate = await dispatch(createRole(data));
      if (createRole.fulfilled.match(resultCreate)) {
        showNofi('success', 'A new role has been created successfully.');
        getRoles();
      } else {
        showNofi('error', 'Role created fail.');
      }
    } else {
      const resultUpdate = await dispatch(updateRole({...data, id: editRole.id}));
      if (updateRole.fulfilled.match(resultUpdate)) {
        showNofi('success', 'Role has been updated successfully.');
        getRoles();
      } else {
        showNofi('error', 'Role updated fail.');
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

  const onEditRole = (record) => {

    setEditRole(record);
    form.setFieldsValue(record);
    showModal();
  };

  const onDeleteRole = async (record) => {

    if (!hasPermission([permissions.DELETE_ROLE])) {
      showNofi('warn', NOT_HAVE_PERMISSION_MESSAGE);
      return;
    }

    if ([RoleConst.ADMIN, RoleConst.QCA, RoleConst.STAFF, RoleConst.CUSTOMER].includes(record.id)){
      showNofi('error', 'Can not delete default role!');
      return;
    }

    const resultDel = await dispatch(deleteRole(record.id));
    if (deleteRole.fulfilled.match(resultDel)) {
      showNofi('success', 'Role has been deleted.');
      getRoles();
    } else {
      showNofi('error', 'Role deleted fail.');
    }
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
      title: 'Role Name',
      dataIndex: 'name',
      className: 'col-Name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Role Permissions',
      dataIndex: 'permissions',
      className: 'col-Permissions',
      key: 'permissions',
      render: (text, record: any) => {

        return (
          <div className="actionUserList">
            <Select
              mode='multiple'
              style={{width: '100%', maxWidth: '500px'}}
              suffixIcon={<CaretDownFilled/>}
              placeholder="Permission is empty"
              value={record.permissions}
              disabled
              showArrow
            >
              {_.map(permissionList, (item, index) => {
                return (
                  <Option key={index} value={item.name}>{item.description}</Option>
                )
              })}

            </Select>
          </div>
        )
      },
      sorter: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      className: 'col-action alignCenter',
      // fixed: 'right',
      render: (text, record: any) => {
        return (
          <div className="actionUserList">
            <HasPermissions permissions={[permissions.UPDATE_ROLE]}>
              <Tooltip title="Edit">
                <Button type="link"
                        onClick={() => onEditRole(record)}
                        icon={record.id == RoleConst.ADMIN ? <EyeTwoTone/> : <EditOutlined/>}/>
              </Tooltip>
            </HasPermissions>

            <HasPermissions permissions={[permissions.DELETE_ROLE]}>
              <DeleteConfirmPopover
                text={<>Do you want to delete role &nbsp;<b>{record.name}</b>?</>}
                onClick={() => onDeleteRole(record)}
                disabled={[RoleConst.ADMIN, RoleConst.QCA, RoleConst.STAFF, RoleConst.CUSTOMER].includes(record.id)}
              />
            </HasPermissions>
          </div>
        )
      },
    },
  ];

  const onTableChange = (pagination: TablePaginationConfig, filters, sorter) => {
    const values = {
      ...pagination,
      ...filters,
      ...{pageNumber: pagination.current},
      // ...{ sortBy: sorter.column ? sorter.columnKey : '', sortDirection: sorter.order === 'ascend' ? 'asc' : 'desc' },
      ...{sort: [sorter.column ? sorter.columnKey : '', sorter.order === 'ascend' ? 'asc' : 'desc']},
    };
    setScreenPagination({...screenPagination, ...values});
    getRoles(values);
  };

  return (
    <>
      <div className="jobTypeManage">
        <PageHeader title="Role Manage"/>

        <div className="btnFieldAddNew">
          <HasPermissions permissions={[permissions.CREATE_ROLE]}>
            <Button type="primary" onClick={onAddNewRole}>
              Add New Role
            </Button>
          </HasPermissions>
        </div>

        <div className="tableListJobType">
          <Table
            dataSource={dataRoleList}
            columns={columns}
            rowKey={record => record.id}
            loading={loadingGetRole}
            // pagination={{ ...screenPagination, ...paginationRoleTable, position: ['bottomRight'] }}
            pagination={false}
            onChange={onTableChange}
            className={`user-table   ${_.isEmpty(dataRoleList) ? 'no-datas' : ''}`}
            // ${data.length === 0 ? 'no-datas' : ''}
            locale={{
              emptyText: 'There are no Role',
              cancelSort: '',
            }}
          />

        </div>


      </div>


      <Modal
        title={`${_.isEmpty(editRole) ? 'Add New Role' : `Edit Role:  ${editRole.name}`}`}
        footer={null}
        closable={false}
        width={800}
        wrapClassName="modalJobType"
        open={isModalVisible}
      >
        <Form
          form={form}
          labelCol={{span: 6}}
          wrapperCol={{span: 18}}
          colon={false}
          labelAlign="left"
          name="savePaymentMethod"
          onFinish={onSaveRole}
        >
          <Form.Item
            label={
              <>
                <>
                  Role Name &nbsp;&nbsp;
                  <Tooltip title="Role Name must be uppercase and 2-50 characters.">
                    <QuestionCircleTwoTone/>
                  </Tooltip>
                </>
              </>
            }
            name="name"
            rules={[
              {required: true, whitespace: true, message: 'This field is required!'},
              {
                validator(rule, value) {
                  if (!value) {
                    return Promise.resolve();
                  }

                  if (!value.match(roleNameRegex)) {
                    return Promise.reject('Role Name must be uppercase and 2-50 characters.');
                  }

                  return Promise.resolve();

                },
              },
            ]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="Select Permissions"
            name="permissions"
            rules={[{required: true, message: 'This field is required!'}]}>
            <Select
              mode='multiple'
              suffixIcon={<CaretDownFilled/>}
              showArrow
              placeholder="Select Permissions"
            >
              {_.map(permissionList, (item, index) => {
                return (
                  <Option key={index} value={item.name}>{item.description}</Option>
                )
              })}

            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{span: 24}} className="formBtnGroup">
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


export default RoleManage;