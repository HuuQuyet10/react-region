import {useParams} from "react-router";
import {useAppDispatch} from "../../../core/app.store";
import {Button, Col, DatePicker, Form, Input, InputNumber, Modal, PageHeader, Row, Select, Tooltip} from "antd";
import {ReactNode, useEffect, useState} from "react";
import {createJob, getJobById, updateJobAct, updateStatusJobAct} from "../../../core/jobManage/effects";
import {useSelector} from "react-redux";
import {getDetailJobByIdSelector} from "../../../core/jobManage/selectors";
import {ReactQuillEditorFormats, ReactQuillModules} from "../../../constants/editorSettings";
import {JobTypeItemResponse} from "../../../core/jobType/models";
import {CalendarOutlined, QuestionCircleTwoTone} from "@ant-design/icons/lib";
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
import {getAllQCOption, getAllQCSelector, getAllStaffOption, getAllStaffSelector} from "../../../core/user/selectors";
import {getJobListObjSelector, getJobTypeListOption, getJobTypeListSelector} from "../../../core/jobType/selectors";
import _ from "lodash";
import ScrollToTop from "../../../components/ScrollToTop";
import {getQcListAct, getStaffListAct, getUserList, updateUser} from "../../../core/user/effects";
import {getAllJobType} from "../../../core/jobType/effects";
import {
  convertCurrency,
  getJobTypeNameFromValue,
  getUsernameFromId,
  hasPermission,
  numberWithCommas,
  showNofi
} from "../../../utils";
import {GetDetailJobResponse} from "../../../core/jobManage/models";
import './style.scss'
import {clearDataJobDetail} from "../../../core/jobManage/job.slice";
import {getLoginUserSelector} from "../../../core/admin/selectors";
import {permissions} from "../../../routes/config/Permissions";

const {Option} = Select;

const ViewJob = () => {

  const {id} = useParams() as { id: string | number };
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();


  const loginUser = useSelector(getLoginUserSelector);
  const detailJob: GetDetailJobResponse = useSelector(getDetailJobByIdSelector);
  const { data: jobTypeList} = useSelector(getJobTypeListSelector);
  const jobTypeListObj = useSelector(getJobListObjSelector);
  const listStaff = useSelector(getAllStaffOption);
  const listQC = useSelector(getAllQCOption);

  const [fileList, setFileList] = useState<string[]>([]);
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
    // dispatch(getUserList({}));
    if (hasPermission([permissions.FIND_WORKER])) {
      dispatch(getQcListAct({}));
      dispatch(getStaffListAct({}));
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
      if(detailJob.attachment){
        setFileList([detailJob.attachment]);
      }
      setJobStatus(detailJob.status);
    }
  }, [detailJob]);

  const RowData = ({title, desc}) => {

    return (
      <>
        <Row gutter={16} className="row-item">
            <Col span={6}>{title}</Col>
            <Col span={18}>{desc}</Col>
        </Row>
      </>
    )
  };


  const confirmChangeJobStatus = async (status: string) => {

    if (!hasPermission([permissions.UPDATE_STATUS_JOB]) ||
      ([JobStatusValue.COMPLETED, JobStatusValue.COMPLETED_LATE].includes(jobStatus) && loginUser.roles.includes(RoleConst.STAFF))){
      showNofi('warn', NOT_HAVE_PERMISSION_MESSAGE);
      return;
    }

    const resultUpdateStatus: any = await dispatch(updateStatusJobAct({id, jobStatus: status}));

    if (updateStatusJobAct.fulfilled.match(resultUpdateStatus)) {
      showNofi('success', 'Job status has been updated successfully!');
      setJobStatus(status);
    } else {
      showNofi('error', resultUpdateStatus?.payload?.message || 'Job status updated fail.');
    }
  };


  return (
    <div className="viewJobPage">
      <ScrollToTop />

      <Row gutter={16}>
        <Col className="gutter-row" span={24}>
          <div className="pageHeading">
            <PageHeader
              title="Job Details"
            />
          </div>
        </Col>


        <Col className="gutter-row" xs={24} sm={24} md={24} lg={16} xl={17} xxl={17}>

          <RowData title="Title Job" desc={detailJob?.name} />
          <RowData title="Description" desc={<span dangerouslySetInnerHTML={{__html: detailJob['description']}} />} />
          <RowData title="Job Types" desc={
            <React.Fragment>
              {detailJob?.items?.map((item, index) => {
                return <React.Fragment key={index}>
                  <Row>
                    <Col span={5}>Image quantity: <b>{numberWithCommas(item?.quantity)}</b></Col>
                    <Col span={7}>{jobTypeListObj[item.jobTypeId]['name']}</Col>
                  </Row>
                </React.Fragment>
              })
              }
            </React.Fragment>
          } />
          <RowData title="Deadline" desc={ moment(detailJob?.deadline).format(DateFormatFull)} />

          {!_.isEmpty(fileList) &&
            <RowData title="File Download" desc={<CustomFileDownload urlsDownload={fileList} />} />
          }

        </Col>



        <Col className="gutter-row" xs={24} sm={24} md={24} lg={8} xl={6} xxl={6}>

            <Form.Item
                labelCol={{ span: 24 }}
                label="Job Status"
            >
                <SelectConfirm
                    confirmMessage="Do you want to change job status to %%NAME%%"
                    data={JobStatusOptions}
                    value={jobStatus}
                    onConfirm={(e)=>{confirmChangeJobStatus(e)}}
                    style={{width: '100%'}}
                    disabled={!hasPermission([permissions.UPDATE_STATUS_JOB] ||
                      ([JobStatusValue.COMPLETED, JobStatusValue.COMPLETED_LATE].includes(jobStatus) && loginUser.roles.includes(RoleConst.STAFF)))}
                    disabledStatus={JobStatusOptions.find(item => item.value == jobStatus)?.disableValue}
                />
            </Form.Item>

          {![RoleConst.CUSTOMER].some((item) => loginUser.roles.includes(item)) &&
          <>
            <div className="flex justify-between row-item">
              <span>Assign Staff:</span>
              <span>{getUsernameFromId(detailJob?.staff, listStaff)}</span>
            </div>

            <div className="flex justify-between row-item">
              <span>Assign QC:</span>
              <span>{getUsernameFromId(detailJob?.qc, listQC)}</span>
            </div>
          </>
          }
        </Col>



      </Row>

    </div>
    )

};


export default ViewJob;