import React, {useEffect, useState} from "react";
import ReactDom from 'react-dom';
import {Button, Col, Form, InputNumber, Modal, PageHeader, Row, Select, Table, Tooltip} from "antd";
import {useHistory} from "react-router";
import {useSelector} from "react-redux";
import {getCustomerListSelector, getUserListSelector} from "../../core/user/selectors";
import {useAppDispatch} from "../../core/app.store";
import {deleteUser, getUserList, updateUser} from "../../core/user/effects";
import './styles.scss';
import {TablePaginationConfig} from "antd/lib/table";
import {useSpring} from "react-spring";
import _ from "lodash";
import {getJobTypeListSelector} from "../../core/jobType/selectors";
import {UserDetailResponse} from "../../core/user/models";
import {JobTypeItemResponse} from "../../core/jobType/models";
import {emailRegex} from "../../constants/variable";
import {createJobType, getAllJobType} from "../../core/jobType/effects";
import {NOT_HAVE_PERMISSION_MESSAGE, RoleConst} from "../../constants";
import {getDetailPriceByCustomer, updatePriceByCustomer} from "../../core/priceManage/effects";
import {convertCurrency, hasPermission, showNofi} from "../../utils";
import {getPriceByCustomerSelector, loadingGetPriceByCustomerSelector} from "../../core/priceManage/selectors";
import {EditOutlined} from "@ant-design/icons";
import {GetPriceByCustomerResponse} from "../../core/priceManage/models";
import PriceTable from "./PriceTable";
import {permissions} from "../../routes/config/Permissions";
import HasPermissions from "../../hoc/HasPermissions";
import CustomInputNumber from "../../components/CustomInputNumber";

const {Option} = Select;

function PriceManager (){

  const [form] = Form.useForm();

  const {pagination: userPagination, isLoading: loadingGetUsers} = useSelector(getUserListSelector);

  const customerList = useSelector(getCustomerListSelector);

  const {data: jobTypeList} = useSelector(getJobTypeListSelector);

  const crrDetailPriceByCustomer: GetPriceByCustomerResponse = useSelector(getPriceByCustomerSelector);
  const loadingGetDetailPriceByCustomer: boolean = useSelector(loadingGetPriceByCustomerSelector);


  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoadingSubmitPrice, setIsLoadingSubmitPrice] = useState(false);
  const [crrSelectedCustomerId, setCrrSelectedCustomerId] = useState<number | any>(undefined);

  const [jobTypeListByCustomer, setJobTypeListByCustomer] = useState<JobTypeItemResponse[]>([])

  const [screenPagination, setScreenPagination] = useState({
    pageNumber: 1,
    pageSize: 20,
    showSizeChanger: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
  });


  const dispatch = useAppDispatch();

  useEffect(() => {
    getCustomerList();
    dispatch(getAllJobType())
  }, []);

  useEffect(() => {
    if (!_.isEmpty(crrDetailPriceByCustomer)){

      const priceList = crrDetailPriceByCustomer.prices?.reduce((acc, crr) => {
        return {...acc, [`${crr.jobTypeId}`]: crr.unitPrice}
      }, {});

      form.setFieldsValue({
        customerId: crrDetailPriceByCustomer.customerId,
        jobTypeIds: priceList
      })
    }
  }, [crrDetailPriceByCustomer]);


  const openModalEdit = (customerId: number) => {

    const selectedCustomer = customerList.find((item: UserDetailResponse) => item.id == customerId);

    const jobTypeByCustomer = jobTypeList.filter((item: JobTypeItemResponse) => selectedCustomer?.jobTypes.includes(item.id));
    setJobTypeListByCustomer(jobTypeByCustomer);

    setCrrSelectedCustomerId(customerId);
    form.resetFields();
    form.setFieldsValue({customerId});
    dispatch(getDetailPriceByCustomer(customerId));
    setIsOpenModal(true);
  };

  const columns = [
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
      title: 'Price List',
      dataIndex: 'email',
      className: 'col-price',
      key: 'tablePrice',
      width: '65%',
      render: (text, record: UserDetailResponse) => {
        return (
          <div>
            <PriceTable key={record.id} customer={record} />
          </div>
        )
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      className: 'col-action alignCenter',
      key: 'action',
      render: (text, record: UserDetailResponse) => {
        return (
          <div>
            <Tooltip title="Edit Price">
            <Button type="link"
                    onClick={() => openModalEdit(record.id)}
                    icon={<EditOutlined />} />
            </Tooltip>
          </div>
        )
      },
    },
  ];

  const getCustomerList = (params?: any) => {

    const values = {
      ...screenPagination,
      pageNumber: 1,
      roleId: RoleConst.CUSTOMER,
      // ...form.getFieldsValue(),
      ...params,
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
    getCustomerList(values);
  };



  const saveAddnewPrice = async (data) => {

    setIsLoadingSubmitPrice(true);

    const priceList = Object.keys(data.jobTypeIds).map(item => {
      return {
        jobTypeId: item,
        unitPrice: data.jobTypeIds[item]
      }
    });

    const payload = {
      customerId: data.customerId,
      prices: priceList
    };

    const resultUpdate = await dispatch(updatePriceByCustomer(payload));
    if (updatePriceByCustomer.fulfilled.match(resultUpdate)){
      showNofi('success', 'Price has been updated successfully.');
      hideModal();
      getCustomerList();
      form.resetFields();
    } else {
      showNofi('error', 'Price has been updated fail.');
    }
    setIsLoadingSubmitPrice(false)

  };

  const openModal = () => {
    setIsOpenModal(true);
    setJobTypeListByCustomer(jobTypeList);
    setCrrSelectedCustomerId(undefined);
    form.resetFields();
  };

  const hideModal = () => {
    setIsOpenModal(false);
  };




  return (
    <>
      <div className="tableUserPrice">

        <div className="pageHeading">
          <PageHeader title="Customer Price Manager"
                      extra={
                        <HasPermissions permissions={[permissions.CREATE_CUSTOMER_PRICES]}>
                          <Button className="btnAddPrice" type="primary" onClick={openModal}>
                            Add New Price
                          </Button>
                        </HasPermissions>
                      }
          />
        </div>

        <Table
          dataSource={customerList}
          columns={columns}
          rowKey={record => `${record.id}`}
          loading={loadingGetUsers}
          pagination={{ ...screenPagination, ...userPagination, position: ['bottomRight'] }}
          onChange={onTableChange}
          className={`user-table   ${_.isEmpty(customerList) ? 'no-datas' : ''}`}
          // ${data.length === 0 ? 'no-datas' : ''}
          locale={{
            emptyText: 'There are no user',
            cancelSort: '',
          }}
        />
      </div>




      <Modal
        title="Add New Price"
        open={isOpenModal}
        onOk={() => setIsOpenModal(false)}
        onCancel={hideModal}
        wrapClassName="modalCreatePrice"
        width="80%"
        footer={null}
      >
        <Form
          form={form}
          colon={false}
          labelAlign="left"
          name="saveAddnewPrice"
          onFinish={saveAddnewPrice}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >

            <Form.Item
              label="Select Customer"
              name="customerId"
              rules={[{ required: true, message: 'This field is required!' }]}
            >
              <Select placeholder="Select Customer"
                      value={crrSelectedCustomerId}
                      onChange={openModalEdit}
                      disabled={loadingGetDetailPriceByCustomer || !hasPermission([permissions.CREATE_CUSTOMER_PRICES])}>
                {_.map(customerList, (item: UserDetailResponse) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.fullName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>


            <Row gutter={20}>
            {
              _.map(jobTypeListByCustomer, (item: JobTypeItemResponse) => {
                return <Col xs={12} sm={12} md={8} lg={8} xl={6} key={item.id}>
                  <Form.Item
                    label={item.name}
                    // name={['jobTypeIds', item.id]} // nếu để name dạng này thì data.jobTypeIds sẽ là 1 array
                    name={['jobTypeIds', `${item.id}`]} // nếu để name dạng này thì data.jobTypeIds sẽ là 1 object
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      { required: true, message: 'Please enter price!' },
                      {
                        validator(rule, value) {
                          if (!value) {
                            return Promise.resolve();
                          }

                          if (value < 0) {
                            return Promise.reject('Price is not valid!');
                          }

                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    {/*<InputNumber*/}
                      {/*addonAfter={'đ'}*/}
                      {/*style={{ width: '100%' }}*/}
                      {/*formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                      {/*parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}*/}
                      {/*disabled={loadingGetDetailPriceByCustomer}*/}
                    {/*/>*/}

                    <CustomInputNumber
                      addonAfter={'đ'}
                      style={{ width: '100%' }}
                      disabled={loadingGetDetailPriceByCustomer}
                      // onChange={(value) => {form.setFieldValue(['jobTypeIds', `${item.id}`], value)}}
                    />
                  </Form.Item>
                </Col>
            })
            }
            </Row>

          <Form.Item wrapperCol={{ span: 24 }} className="formBtnGroup">
            <Button
              type="primary"
              className="btnSave"
              loading={isLoadingSubmitPrice}
              // loading={loadingSave}
              disabled={loadingGetDetailPriceByCustomer}
              htmlType="submit"
            >
              Save
            </Button>
            <Button type="default"
                    disabled={isLoadingSubmitPrice || loadingGetDetailPriceByCustomer}
                    onClick={hideModal}>
              Cancel
            </Button>
          </Form.Item>


        </Form>
      </Modal>


    </>
  )

}


export default PriceManager;