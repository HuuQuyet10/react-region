import React, {useEffect, useState} from "react";
import ReactDom from 'react-dom';
import {useSelector} from "react-redux";
import {getLoginUserSelector} from "../../core/admin/selectors";
import {Link} from "react-router-dom";
import RouteConst, {RoleConst} from "../../constants";
import {Button} from "antd";
import './style.scss'
import {permissions} from "../../routes/config/Permissions";
import HasPermissions from "../../hoc/HasPermissions";



function Home (){

  const loginUser = useSelector(getLoginUserSelector);


  const data = [
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "null",
      "regexApiEndPoint": "null",
      "permissionCode": "DM0002",
      "permissionParentCode": "null",
      "permissionName": "Tiếp đón",
      "menuType": "1",
      "type": "1",
      "apiEndPointName": "null"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "null",
      "regexApiEndPoint": "null",
      "permissionCode": "DM0003",
      "permissionParentCode": "DM0002",
      "permissionName": "Người bệnh",
      "menuType": "1",
      "type": "1",
      "apiEndPointName": "null"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "null",
      "regexApiEndPoint": "null",
      "permissionCode": "1001",
      "permissionParentCode": "DM0003",
      "permissionName": "Màn hình danh sách bệnh nhân",
      "menuType": "1",
      "type": "1",
      "apiEndPointName": "null"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "POST/medical-record/search",
      "regexApiEndPoint": "^(?:POST|post)/medical-record/search$",
      "permissionCode": "1002",
      "permissionParentCode": "1001",
      "permissionName": "Api lấy danh sách hồ sơ bệnh nhân",
      "menuType": "2",
      "type": "1",
      "apiEndPointName": "medical-record/search"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "null",
      "regexApiEndPoint": "null",
      "permissionCode": "1003",
      "permissionParentCode": "DM0003",
      "permissionName": "Thêm mới thêm mới bệnh nhân",
      "menuType": "1",
      "type": "1",
      "apiEndPointName": "null"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "POST/patient/search",
      "regexApiEndPoint": "^(?:POST|post)/patient/search$",
      "permissionCode": "1004",
      "permissionParentCode": "1003",
      "permissionName": "API hỗ trợ tìm kiếm nhanh thông tin bênh nhân nhanh. Để fill thông tin vào form",
      "menuType": "2",
      "type": "1",
      "apiEndPointName": "patient/search"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "GET/insurance/{irsCard}",
      "regexApiEndPoint": "^(?:GET|get)/insurance/[A-Za-z]{2}[0-9]{13}$",
      "permissionCode": "1005",
      "permissionParentCode": "1003",
      "permissionName": "API lấy thông tin tỷ lệ hưởng bảo hiểm",
      "menuType": "2",
      "type": "1",
      "apiEndPointName": "insurance/{irsCard}"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "POST/medical-record",
      "regexApiEndPoint": "^(?:POST|post)/medical-record$",
      "permissionCode": "1006",
      "permissionParentCode": "1003",
      "permissionName": "API lưu thông tin hồ sơ",
      "menuType": "2",
      "type": "1",
      "apiEndPointName": "medical-record"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "null",
      "regexApiEndPoint": "null",
      "permissionCode": "1007",
      "permissionParentCode": "DM0003",
      "permissionName": "Nhập Thông tin bênh nhân",
      "menuType": "1",
      "type": "1",
      "apiEndPointName": "null"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "GET/medical-record/{id}",
      "regexApiEndPoint": "^(?:GET|get)/medical-record/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
      "permissionCode": "1008",
      "permissionParentCode": "1007",
      "permissionName": "API lấy thông tin hồ sơ bênh nhân",
      "menuType": "2",
      "type": "1",
      "apiEndPointName": "medical-record/{id}"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "GET/patient/{patientId}/medical-records",
      "regexApiEndPoint": "^(?:GETget)/patient/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/medical-records$",
      "permissionCode": "1023",
      "permissionParentCode": "1007",
      "permissionName": "API lấy thông tin hồ sơ bênh nhân",
      "menuType": "2",
      "type": "1",
      "apiEndPointName": "patient/{patientId}/medical-records"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "null",
      "regexApiEndPoint": "null",
      "permissionCode": "1009",
      "permissionParentCode": "DM0003",
      "permissionName": "Xuất Thông tin bênh nhân",
      "menuType": "1",
      "type": "1",
      "apiEndPointName": "null"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "null",
      "regexApiEndPoint": "null",
      "permissionCode": "1010",
      "permissionParentCode": "1009",
      "permissionName": "Thông tin dịch vụ của màn chi tiết hồ sơ bệnh nhân",
      "menuType": "1",
      "type": "1",
      "apiEndPointName": "null"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "POST/patient-medical-service/search",
      "regexApiEndPoint": "^(?:POST|post)/patient-medical-service/search$",
      "permissionCode": "1011",
      "permissionParentCode": "1010",
      "permissionName": "Api lấy danh sách dịch vụ đã được chỉ định",
      "menuType": "2",
      "type": "1",
      "apiEndPointName": "patient-medical-service/search"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "GET/medical-record/{medicalRecordId}/payment-info",
      "regexApiEndPoint": "^(?:GETget)/medical-record/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/payment-info$",
      "permissionCode": "1012",
      "permissionParentCode": "1010",
      "permissionName": "Api lấy thông tin cần thanh toán theo hồ sơ bệnh nhân",
      "menuType": "2",
      "type": "1",
      "apiEndPointName": "medical-record/{medicalRecordId}/payment-info"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "GET/patient-medical-service/room-with-sum-patient",
      "regexApiEndPoint": "^(?:GET|get)/patient-medical-service/room-with-sum-patient$",
      "permissionCode": "1015",
      "permissionParentCode": "1010",
      "permissionName": "Api lấy ra danh sách phòng kèm tổng số lượng bệnh nhân",
      "menuType": "2",
      "type": "1",
      "apiEndPointName": "patient-medical-service/room-with-sum-patient"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "POST/patient-medical-service/v2/{id}/{sourceType}",
      "regexApiEndPoint": "^(?:POST|post)/patient-medical-service/v2/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.*$",
      "permissionCode": "1016",
      "permissionParentCode": "1010",
      "permissionName": "Api chỉ định dịch vụ bên tiếp đón",
      "menuType": "2",
      "type": "1",
      "apiEndPointName": "patient-medical-service/v2/{id}/{sourceType}"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "DELETE/patient-medical-service",
      "regexApiEndPoint": "^(?:DELETE|delete)/patient-medical-service$",
      "permissionCode": "1017",
      "permissionParentCode": "1010",
      "permissionName": "Api xóa dịch vụ",
      "menuType": "2",
      "type": "1",
      "apiEndPointName": "patient-medical-service"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "POST/patient-medical-service/refund",
      "regexApiEndPoint": "^(?:POST|post)/patient-medical-service/refund$",
      "permissionCode": "1018",
      "permissionParentCode": "1010",
      "permissionName": "Api hoàn  dịch vụ",
      "menuType": "2",
      "type": "1",
      "apiEndPointName": "patient-medical-service/refund"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "null",
      "regexApiEndPoint": "null",
      "permissionCode": "1013",
      "permissionParentCode": "1009",
      "permissionName": "Lịch sử chuyển đối tượng của màn hình chi tiết hồ sơ bệnh nhân",
      "menuType": "1",
      "type": "1",
      "apiEndPointName": "null"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "GET/medical-record/type-history/{id}",
      "regexApiEndPoint": "^(?:GET|get)/medical-record/type-history/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
      "permissionCode": "1014",
      "permissionParentCode": "1013",
      "permissionName": "Api lấy lịch sử chuyển đối tượng của màn hình chi tiết hồ sơ bệnh nhân",
      "menuType": "2",
      "type": "1",
      "apiEndPointName": "medical-record/type-history/{id}"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "null",
      "regexApiEndPoint": "null",
      "permissionCode": "1019",
      "permissionParentCode": "1009",
      "permissionName": "In trong màn hình chi tiết hồ sơ",
      "menuType": "1",
      "type": "1",
      "apiEndPointName": "null"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "POST/patient-medical-service/print",
      "regexApiEndPoint": "^(?:POST|post)/patient-medical-service/print$",
      "permissionCode": "1020",
      "permissionParentCode": "1019",
      "permissionName": "Api in trong màn hình chi tiết hồ sơ",
      "menuType": "2",
      "type": "1",
      "apiEndPointName": "patient-medical-service/print"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "null",
      "regexApiEndPoint": "null",
      "permissionCode": "1021",
      "permissionParentCode": "1009",
      "permissionName": "Lịch sử khám trong màn hình chi tiết hồ sơ",
      "menuType": "1",
      "type": "1",
      "apiEndPointName": "null"
    },
    {
      "username": "admin",
      "roleName": "Bác sĩ",
      "featureName": "Nhóm khám bệnh",
      "apiEndPoint": "GET/treatment-medical-supply",
      "regexApiEndPoint": "^(?:GET|get)/treatment-medical-supply$",
      "permissionCode": "1022",
      "permissionParentCode": "1021",
      "permissionName": "Api danh sách thuốc và vật tư y tế",
      "menuType": "2",
      "type": "1",
      "apiEndPointName": "treatment-medical-supply"
    }
  ]

  useEffect(() => {


    const tree = buildTree(data);
    console.log(tree)
    // for (const root of tree) {
    //   printTree(root);
    // }

  }, []);

  interface Permission {
    featureName: string;
    permissionCode: string;
    permissionParentCode: string | null;
    permissionName: string;
    children?: Permission[];
  }


  const buildTree = (data: Permission[]) => {
    const map: Record<string, Permission> = {};
    const roots: Permission[] = [];

    data.forEach(permission => {
      map[permission.permissionCode] = { ...permission, children: [] };
    });

    data.forEach(permission => {
      const parent = map[permission.permissionParentCode || ''];

      if (parent) {
        parent.children?.push(map[permission.permissionCode]);
      } else {
        roots.push(map[permission.permissionCode]);
      }
    });


    console.log('roots', roots)
    return roots;
  };

  function printTree(node, prefix = '') {
    console.log(`${prefix}${node.permissionName} (${node.permissionCode})`);
    for (const child of node.children) {
      printTree(child, `${prefix}  `);
    }
  }



  return (
    <div className="homepage">

      <div className="msgWelcome">
        Welcome back, <span className="semiBold">{loginUser.fullName || ''}</span>
      </div>

      <div className="btnGroups">

        <HasPermissions permissions={[permissions.CREATE_JOB]}>
        <Link to={RouteConst.JOB_CREATE}>
          <Button type="primary">Create Job</Button>
        </Link>
        </HasPermissions>

        <HasPermissions permissions={[permissions.FIND_JOB]}>
        <Link to={RouteConst.JOB_LIST}>
          <Button type="primary">Job Manager</Button>
        </Link>
        </HasPermissions>

        <HasPermissions permissions={[permissions.FIND_USER]}>
          <Link to={RouteConst.USER_LIST}>
            <Button type="primary">User Manager</Button>
          </Link>
        </HasPermissions>

        <HasPermissions permissions={[permissions.GET_CUSTOMER_PRICES]}>
          <Link to={RouteConst.PRICE_MANAGER}>
            <Button type="primary">Price Manager</Button>
          </Link>
        </HasPermissions>

        <HasPermissions permissions={[permissions.FIND_TRANSACTION]}>
          <Link to={RouteConst.TRANSACTIONS_MANAGER}>
            <Button type="primary">Transactions</Button>
          </Link>
        </HasPermissions>
      </div>
    </div>
  )
}


export default Home;