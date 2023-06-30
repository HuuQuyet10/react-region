import React, {useEffect, useState} from "react";
import {Form, Input, Button, Typography, Image, Alert, Tooltip, Table, PageHeader} from 'antd';
import {useSelector, useDispatch} from "react-redux";
import {Link, Redirect, useHistory} from "react-router-dom";
import {CSSTransition} from "react-transition-group";
import {useSpring, animated} from "react-spring";
import {deleteUser, getUserList, toggleActiveUser} from "../../../core/user/effects";
import {EditOutlined} from "@ant-design/icons";
import * as RouteConst from "../../../constants/RouteConst";
import {RootState, useAppDispatch} from "../../../core/app.store";
import _ from "lodash";
import {getSafeValue, hasPermission, showNofi} from "../../../utils";
import SwitchPopconfirm from "../../../components/SwitchPopconfirm";
import {NOT_HAVE_PERMISSION_MESSAGE, StatusUser} from "../../../constants";
import {getUserListSelector} from "../../../core/user/selectors";
import {permissions} from "../../../routes/config/Permissions";
import HasPermissions from "../../../hoc/HasPermissions";
import {EyeTwoTone} from "@ant-design/icons/lib";
import {UserDetailResponse} from "../../../core/user/models";
import {getAllRole} from "../../../core/roleManage/effects";
import {getRoleListOption, getRoleListSelector} from "../../../core/roleManage/selectors";
import {RoleItemResponse} from "../../../core/roleManage/models";
import SelectOption from "../../../components/SelectOption";
import {ColumnsType, TablePaginationConfig} from "antd/es/table";
import {OptionModel} from "../../../models";


const {Title} = Typography;

const UserList = () => {
    const [form] = Form.useForm();
    const history = useHistory();

  const {data, pagination: userPagination, isLoading: loadingGetUsers} = useSelector(getUserListSelector);
  const {data: roleList} = useSelector(getRoleListSelector);
  const roleListOption: OptionModel[] = useSelector(getRoleListOption);
  const [filterParams, setFilterParrams] = useState({});

  const [screenPagination, setScreenPagination] = useState({
    pageNumber: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
  });


  const dispatch = useAppDispatch();
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



  useEffect(() => {
    getUserTableList();
    getAllRoleFn();

  }, []);

  useEffect(() => {
    getUserTableList()
  }, [filterParams]);

  const onDelete = async (record) => {

    const resultDelete = await dispatch(deleteUser(record.id));

    if (deleteUser.fulfilled.match(resultDelete)) {
      showNofi('success', 'An user has been deleted.');
      getUserTableList();
    } else {
      showNofi('error', 'There are some error when delete user.');
    }

  };


  const onSwicthStatusUser = async (record) => {
    // if (record.status == StatusUser.ACTIVE){
    //   console.log('enabled', record);
    // } else {
    //   console.log('disable', record);
    // }

    if (!hasPermission([permissions.ACTIVE_INACTIVE_USER])) {
      showNofi('warn', NOT_HAVE_PERMISSION_MESSAGE);
      return;
    }

    const resultSwitch = await dispatch(toggleActiveUser(record.id));

    if (toggleActiveUser.fulfilled.match(resultSwitch)) {
      showNofi('success', 'User status has been updated successfully.');
      getUserTableList();
    } else {
      showNofi('error', 'User status updated fail.');
    }

  };

  const onFilterChangeRole = (param) => {
    setFilterParrams({...filterParams, ...param});
  };

  const onFilterChangeUserStatus = (param) => {
    setFilterParrams({...filterParams, ...param});
  };

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      className: 'col-Id alignCenter',
      key: 'id',
    },
    {
      title: 'User Name',
      dataIndex: 'userName',
      className: 'col-userName',
      key: 'userName',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      className: 'col-fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      className: 'col-email',
      key: 'email',
    },
    {
      title: 'User Role',
      dataIndex: 'role',
      className: 'col-role',
      key: 'role',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <SelectOption
            data={roleListOption}
            placeholder="- Select Role -"
            allowClear={true}
            style={{width: '100%'}}
            onChange={(value) => {onFilterChangeRole({roleId: value})}}
          ></SelectOption>
        </div>
      ),
      // onFilterDropdownOpenChange: (visible) => {
      //   console.log('visible', visible)
      // },
      onFilter: (value, record: UserDetailResponse) => {return true},
      render: (text, record: UserDetailResponse) => {

        const userRole = roleList?.find((item: RoleItemResponse) => item.id == record?.roles[0]);
        return (
          <>
            {userRole?.name || ''}
          </>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      className: 'col-status alignCenter',
      key: 'status',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <SelectOption
            data={[
              {label: 'Active', value: 'ACTIVE'},
              {label: 'In-Active', value: 'INACTIVE'},
            ]}
            placeholder="- Select Status -"
            allowClear={true}
            style={{width: '100%'}}
            onChange={(value) => {onFilterChangeUserStatus({status: value})}}
          ></SelectOption>
        </div>
      ),
      onFilter: (value, record: UserDetailResponse) => {return true},
      render: (text, record: UserDetailResponse) => {
        return (
          <>
            <SwitchPopconfirm
              checked={record.status == StatusUser.ACTIVE}
              disabled={!hasPermission([permissions.ACTIVE_INACTIVE_USER])}
              text={
                record.status == StatusUser.ACTIVE
                  ? 'Are you want to disable this user?'
                  : 'Are you want to enable this user?'
              }
              onOk={() => onSwicthStatusUser(record)}
            />
          </>
        )
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      className: 'col-action alignCenter',
      // fixed: 'right',
      render: (text, record: any) => {
        return (
          <div className="actionUserList">
            <HasPermissions permissions={[permissions.UPDATE_USER, permissions.VIEW_USER]}>
            <Tooltip title={!hasPermission([permissions.UPDATE_USER]) ? 'View User' : 'Edit User'}>
              <Link to={RouteConst.USER_DETAIL.replace(':id', record.id)}>
                <Button type="link" icon={!hasPermission([permissions.UPDATE_USER]) ? <EyeTwoTone /> : <EditOutlined />} />
              </Link>
            </Tooltip>
            </HasPermissions>

            {/*<DeleteConfirmPopover*/}
              {/*text={*/}
                {/*<>Do you want to delete user &nbsp; <b>{record.fullName}</b>?</>*/}
              {/*}*/}
              {/*onClick={() => onDelete(record)}*/}
            {/*/>*/}
          </div>
        )
      },
    },
  ];


  const getAllRoleFn = () => {
    dispatch(getAllRole());
  };

  const getUserTableList = (params?: any) => {

    const values = {
      ...screenPagination,
      pageNumber: 1,
      // ...form.getFieldsValue(),
      ...params,
      ...filterParams
      // roleId: 4, // hardcode tạm thời để test, BE sẽ xử lý để ko truyền thì gọi hết
    };
    // dispatch(searchAgents(values));
    dispatch(getUserList(values));
  };

  const onTableChange = (pagination: TablePaginationConfig, filters, sorter) => {
    const values = {
      ...pagination,
      ...filters,
      ...{ pageNumber: pagination.current },
      ...{ sortBy: sorter.column ? sorter.columnKey : '', sortDirection: sorter.order === 'ascend' ? 'asc' : 'desc' },
    };
    setScreenPagination({ ...screenPagination, ...values });
    getUserTableList(values);
  };


  return (
    <>
      <div className="tableUserList">

        <PageHeader title="User List" />

        <Table
          dataSource={data}
          columns={columns}
          rowKey={record => record.id}
          loading={loadingGetUsers}
          pagination={{ ...screenPagination, ...userPagination, position: ['topRight', 'bottomRight'] }}
          onChange={onTableChange}
          className={`user-table   ${_.isEmpty(data) ? 'no-datas' : ''}`}
          // ${data.length === 0 ? 'no-datas' : ''}
          locale={{
            emptyText: 'There are no user',
            cancelSort: '',
          }}
          scroll={{x: '1200px'}}
        />
      </div>
    </>
    )

};

export default UserList;
