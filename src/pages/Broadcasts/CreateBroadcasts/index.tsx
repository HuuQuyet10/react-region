import React, {useEffect, useState} from "react";
import {Form, Typography, PageHeader, Row, Col, Modal, Button} from 'antd';
import {useSpring, animated} from "react-spring";
import {useAppDispatch} from "../../../core/app.store";
import {CalendarOutlined, CaretDownFilled, QuestionCircleTwoTone} from "@ant-design/icons";
import './styles.scss';
import {ReactQuillEditorFormats, ReactQuillModules} from "../../../constants/editorSettings";
import ReactQuill from "react-quill";
import {showNofi} from "../../../utils";
import ReactRouterPause from '@allpro/react-router-pause';
import {createBroadcasts, getBroadcasts} from "../../../core/user/effects";
import RouteConst from "../../../constants";
import {Link} from "react-router-dom";


const CreateBroadcasts = () => {

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const [formIsDirty, setFormIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // getBroadcastsMessage();
  }, []);


  const getBroadcastsMessage = () => {
    dispatch(getBroadcasts());
  };

  const onSubmitCreateBroadcasts = async data => {

    setLoading(true);

    const resultCreate = await dispatch(createBroadcasts({content: data.description}));
    if (createBroadcasts.fulfilled.match(resultCreate)) {
      showNofi('success', 'Broadcasts has been updated successfully.');
      setFormIsDirty(false);
    } else {
      showNofi('error', 'Broadcasts updated fail.');
    }
    setLoading(false);
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


  return (
    <>
      <ReactRouterPause handler={handleNavigation} when={formIsDirty} />
      <div className="createBroadcastsPage">
        <Row gutter={16}>
          <Col className="gutter-row" span={24}>
            <div className="pageHeading">
              <PageHeader
                title="Broadcasts Message"
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
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 24 }}
                labelAlign="left"
                onFinish={onSubmitCreateBroadcasts}
                onValuesChange={() => onValuesChange()}
                autoComplete="off"
                layout="vertical"
                colon={false}
              >

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: true, message: 'This field is required!' }]}
                >
                  {/*<TextArea rows={10} />*/}
                  <ReactQuill
                    theme={'snow'}
                    modules={ReactQuillModules}
                    formats={ReactQuillEditorFormats}
                    className="qillEditor"
                  />
                </Form.Item>

                <Form.Item className="form-buttons" wrapperCol={{ span: 24 }}>
                  <Button
                    type="primary"
                    loading={loading}
                    htmlType="submit">
                    Update Broadcasts
                  </Button>

                  <Link to={RouteConst.JOB_LIST}>
                    <Button type="default">Go To Job List</Button>
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

export default CreateBroadcasts;
