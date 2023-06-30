import React, {useEffect, useState} from "react";
import {Form, Typography, PageHeader, Row, Col, Modal, Button, Tooltip, Input, Select, Checkbox, Table} from 'antd';
import {useSpring, animated} from "react-spring";
import {CalendarOutlined, CaretDownFilled, QuestionCircleTwoTone} from "@ant-design/icons";
import ReactQuill from "react-quill";
import ReactRouterPause from '@allpro/react-router-pause';
import {Link} from "react-router-dom";
import {useAppDispatch} from "../../core/app.store";
import {createBroadcasts, deleteBroadcast, getBroadcasts, toggleActiveUser, updateBroadcast} from "../../core/user/effects";
import {hasPermission, showNofi} from "../../utils";
import {ReactQuillEditorFormats, ReactQuillModules} from "../../constants/editorSettings";
import RouteConst, {NOT_HAVE_PERMISSION_MESSAGE, RoleConst, StatusUser} from "../../constants";
import {BroadcastResponseItem, UserDetailResponse} from "../../core/user/models";
import _ from "lodash";
import './styles.scss';
import {permissions} from "../../routes/config/Permissions";
import {useSelector} from "react-redux";
import {selectAllBroadcasts, selectLoadingGetBroadcasts} from "../../core/user/selectors";
import DeleteConfirmPopover from "../../components/DeleteConfirmPopover";
import HasPermissions from "../../hoc/HasPermissions";
import {EditOutlined, EyeTwoTone} from "@ant-design/icons/lib";
import {deleteRole} from "../../core/roleManage/effects";
import SelectOption from "../User/List";
import SwitchPopconfirm from "../../components/SwitchPopconfirm";


const BroadcastsManage = () => {

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const allBroadcasts = useSelector(selectAllBroadcasts);
  const loadingGetBroadcasts = useSelector(selectLoadingGetBroadcasts);
  const [formIsDirty, setFormIsDirty] = useState(false);
  const [editBroadcast, setEditBroadcast] = useState<BroadcastResponseItem>({} as BroadcastResponseItem);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    getBroadcastsMessage();
  }, []);


  const getBroadcastsMessage = () => {
    dispatch(getBroadcasts());
  };

  const onSubmitSaveBroadcasts = async data => {

    setLoadingSave(true);

    if (_.isEmpty(editBroadcast)) {
      const resultCreate = await dispatch(createBroadcasts({content: data.content}));
      if (createBroadcasts.fulfilled.match(resultCreate)) {
        showNofi('success', 'Broadcast has been created successfully.');
        hideModal();
        form.resetFields();
        getBroadcastsMessage();
        setFormIsDirty(false);
      } else {
        showNofi('error', 'Broadcast created fail.');
      }
    } else {
      const params = {...data, id: editBroadcast.id};
      const resultUpdate = await dispatch(updateBroadcast(params));
      if (updateBroadcast.fulfilled.match(resultUpdate)) {
        showNofi('success', 'Broadcast has been updated successfully.');
        hideModal();
        form.resetFields();
        getBroadcastsMessage();
        setFormIsDirty(false);
      } else {
        showNofi('error', 'Broadcast updated fail.');
      }
    }


    setLoadingSave(false);
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

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const onAddNewBroadcast = () => {
    setEditBroadcast({} as BroadcastResponseItem);
    form.resetFields();

    if (!hasPermission([permissions.CREATE_BROADCAST])) {
      showNofi('warn', NOT_HAVE_PERMISSION_MESSAGE);
      return;
    }

    showModal();
  };

  const showModal = () => {
    setIsModalVisible(true);
  };


  const onDeleteBroadcast = async (record: BroadcastResponseItem) => {

    const resultDel = await dispatch(deleteBroadcast(record));
    if (deleteBroadcast.fulfilled.match(resultDel)) {
      showNofi('success', 'Broadcast has been deleted.');
      getBroadcastsMessage();
    } else {
      showNofi('error', 'Broadcast deleted fail.');
    }
  };


  const onEditBroadcast = (record: BroadcastResponseItem) => {

    setEditBroadcast(record);
    form.setFieldsValue(record);
    showModal();
  };


  const toggleActiveBroadcast = async (record: BroadcastResponseItem) => {

    if (!hasPermission([permissions.UPDATE_BROADCAST])) {
      showNofi('warn', NOT_HAVE_PERMISSION_MESSAGE);
      return;
    }

     const params = {...record, show: !record.show};
    const resultUpdate = await dispatch(updateBroadcast(params));
    if (updateBroadcast.fulfilled.match(resultUpdate)) {
      showNofi('success', 'Broadcast has been updated successfully.');
      getBroadcastsMessage();
    } else {
      showNofi('error', 'Broadcast updated fail.');
    }

  };


  const columns = [
    {
      title: 'Content',
      dataIndex: 'content',
      className: 'col-content',
      key: 'content',
      render: (text, record: BroadcastResponseItem) => {
        return (
          <>
            <span dangerouslySetInnerHTML={{__html: record?.content || ''}} />
          </>
        )
      }
    },
    {
      title: 'Show',
      dataIndex: 'show',
      className: 'col-status alignCenter',
      key: 'show',
      width: 120,
      render: (text, record: BroadcastResponseItem) => {
        return (
          <>
            <SwitchPopconfirm
              checked={record.show}
              disabled={!hasPermission([permissions.UPDATE_BROADCAST])}
              text={
                record.show
                  ? 'Are you want to hide this broadcast?'
                  : 'Are you want to show this broadcast?'
              }
              onOk={() => toggleActiveBroadcast(record)}
            />
          </>
        )
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      className: 'col-action alignCenter',
      width: 120,
      render: (text, record: BroadcastResponseItem) => {
        return (
          <div className="actionUserList">
            <HasPermissions permissions={[permissions.UPDATE_BROADCAST]}>
              <Tooltip title="Update Broadcast">
                <Button type="link"
                        onClick={() => onEditBroadcast(record)}
                        icon={<EditOutlined/>}/>
              </Tooltip>
            </HasPermissions>

            <HasPermissions permissions={[permissions.DELETE_BROADCAST]}>
              <DeleteConfirmPopover
                text="Do you want to delete this broadcast?"
                onClick={() => onDeleteBroadcast(record)}
                title="Delete Broadcast"
              />
            </HasPermissions>
          </div>
        )
      },
    },
  ];


  return (
    <div className='broadcastManagePage'>
      <ReactRouterPause handler={handleNavigation} when={formIsDirty} />


      <PageHeader title="Broadcast Manage"
                  extra={
                    <>
                      <Button type="primary" onClick={onAddNewBroadcast}>
                        New Broadcast
                      </Button>
                    </>
                  }
      />


      <div className="tableListBroadcasts">
        <Table
          dataSource={allBroadcasts}
          columns={columns}
          rowKey={record => record.id}
          loading={loadingGetBroadcasts}
          pagination={false}
          className={`user-table ${_.isEmpty(allBroadcasts) ? 'no-datas' : ''}`}
          // ${data.length === 0 ? 'no-datas' : ''}
          locale={{
            emptyText: 'There is no Broadcast',
          }}
        />

      </div>


      <Modal
        title={`${_.isEmpty(editBroadcast) ? 'New Broadcast' : `Update Broadcast`}`}
        footer={null}
        closable={false}
        width={800}
        wrapClassName="modalJobType"
        open={isModalVisible}
      >
        <Form
          form={form}
          name="form-broadcast"
          onFinish={onSubmitSaveBroadcasts}
          onValuesChange={() => onValuesChange()}
          autoComplete="off"
          layout="vertical"
          colon={false}
        >
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: 'This field is required!' }]}
          >
            <ReactQuill
              theme={'snow'}
              modules={ReactQuillModules}
              formats={ReactQuillEditorFormats}
              className="qillEditor"
            />
          </Form.Item>


          <Row gutter={10}>
            {!_.isEmpty(editBroadcast) &&
            <Col span={10}>
              <Form.Item
                label={false}
                name="show"
                valuePropName="checked"
              >
                <Checkbox>Show Broadcast</Checkbox>
              </Form.Item>
            </Col>
            }

            <Col span={!_.isEmpty(editBroadcast) ? 14 : 24}>
              <Form.Item wrapperCol={{span: 24}} className="formBtnGroup">
                <Button
                  type="primary"
                  className="btnSave"
                  loading={loadingSave}
                  htmlType="submit"
                >
                  Save
                </Button>
                <Button type="default" disabled={loadingSave} onClick={hideModal}>
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>



        </Form>
      </Modal>

    </div>
  )

}

export default BroadcastsManage;
