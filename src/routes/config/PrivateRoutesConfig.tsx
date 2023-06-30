import * as RouteConst from "../../constants/RouteConst";
import Home from "../../pages/Home";
import UserList from "../../pages/User/List";
import {DatabaseOutlined, HomeOutlined, SettingOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import JobTypeManage from "../../pages/JobType";
import RoleManage from "../../pages/RoleManage";
import UserDetail from "../../pages/User/Detail";
import CreateUser from "../../pages/User/createUser";
import JobList from "../../pages/Job/JobList";
import CreateJob from "../../pages/Job/CreateJob";
import IconPriceList from "../../components/Icons/icnPriceList";
import PriceManager from "../../pages/PriceManager";
import {permissions} from "./Permissions";
import ViewJob from "../../pages/Job/ViewJob";
import UpdateJob from "../../pages/Job/UpdateJob";
import IconRoleManager from "../../components/Icons/icnRole";
import IconJobType from "../../components/Icons/icnJobType";
import ChangePassword from "../../pages/MyAccount/ChangePassword";
import TransactionsList from "../../pages/Transactions/TransactionsList";
import IconTransaction from "../../components/Icons/icnTransaction";
import IconBroadcasts from "../../components/Icons/icnBroadcasts";
import CreateBroadcasts from "../../pages/Broadcasts/CreateBroadcasts";
import BroadcastsManage from "../../pages/Broadcasts";


export interface RouteConfig{
    component: React.FC,
    path: string,
    name: string,
    exact?: boolean,
    isMenu?: boolean,
    icon?: React.FC,
    children?: RouteConfig[],
    permission?: string[],
    keyMenu?: string
}

const RouterMenu: RouteConfig[] = [
  {
    component: Home,
    path: RouteConst.HOME,
    name: 'Home',
    exact: true,
    isMenu: true,
    icon: HomeOutlined,
  },
  {
    component: JobList,
    path: RouteConst.JOB_LIST,
    name: 'Jobs Manage',
    keyMenu: 'jobs',
    isMenu: true,
    icon: DatabaseOutlined,
    permission: [permissions.FIND_JOB, permissions.CREATE_JOB],
    children: [
      {
        component: JobList,
        path: RouteConst.JOB_LIST,
        name: 'Job List',
        exact: true,
        isMenu: true,
        permission: [permissions.FIND_JOB],
      },
      {
        component: UpdateJob,
        path: RouteConst.JOB_DETAIL,
        name: 'Job Detail',
        permission: [permissions.UPDATE_JOB]
      },
      {
        component: ViewJob,
        path: RouteConst.VIEW_JOB,
        name: 'View Job',
        permission: [permissions.VIEW_JOB]
      },
      {
        component: CreateJob,
        path: RouteConst.JOB_CREATE,
        name: 'Create Job',
        exact: true,
        isMenu: true,
        permission: [permissions.CREATE_JOB]
      },

    ]
  },
  {
    component: UserList,
    path: RouteConst.USER_LIST,
    name: 'User Manage',
    keyMenu: 'user',
    isMenu: true,
    icon: UsergroupAddOutlined,
    permission: [permissions.FIND_USER, permissions.UPDATE_USER, permissions.VIEW_USER],
    children: [
      {
        component: UserList,
        path: RouteConst.USER_LIST,
        name: 'User List',
        exact: true,
        isMenu: true,
        permission: [permissions.FIND_USER]
      },
      {
        component: UserDetail,
        path: RouteConst.USER_DETAIL,
        name: 'User Detail',
        exact: true,
        permission: [permissions.UPDATE_USER]
      },
      {
        component: CreateUser,
        path: RouteConst.USER_CREATE,
        name: 'Create User',
        exact: true,
        isMenu: true,
        permission: [permissions.ADD_USER]
      },
    ]
  },
  // {
  //   component: JobTypeManage,
  //   path: RouteConst.JOB_TYPE_MANAGE,
  //   name: 'Settings',
  //   keyMenu: 'settings',
  //   isMenu: true,
  //   icon: SettingOutlined,
  //   permission: [permissions.FIND_JOB_TYPE, permissions.GET_ALL_ROLES, permissions.VIEW_USER],
  //   children: [
  //     {
  //       component: JobTypeManage,
  //       path: RouteConst.JOB_TYPE_MANAGE,
  //       name: 'Job Type Manage',
  //       exact: true,
  //       isMenu: true,
  //       permission: [permissions.FIND_JOB_TYPE],
  //     },
  //     {
  //       component: RoleManage,
  //       path: RouteConst.ROLE_MANAGE,
  //       name: 'Role Manage',
  //       exact: true,
  //       isMenu: true,
  //       permission: [permissions.GET_ALL_ROLES],
  //     },
  //   ]
  // },
  {
    component: RoleManage,
    path: RouteConst.ROLE_MANAGE,
    name: 'Role Manage',
    exact: true,
    isMenu: true,
    icon: IconRoleManager,
    permission: [permissions.GET_ALL_ROLES],
  },
  {
    component: JobTypeManage,
    path: RouteConst.JOB_TYPE_MANAGE,
    name: 'Job Type Manage',
    exact: true,
    isMenu: true,
    icon: IconJobType,
    permission: [permissions.FIND_JOB_TYPE],
  },
  {
    component: PriceManager,
    path: RouteConst.PRICE_MANAGER,
    name: 'Price Manager',
    exact: true,
    isMenu: true,
    icon: IconPriceList,
    permission: [permissions.GET_CUSTOMER_PRICES],
  },
  {
    component: ChangePassword,
    path: RouteConst.MY_ACCOUNT_CHANGE_PASSWORD,
    name: 'Price Manager',
    exact: true,
  },
  {
    component: TransactionsList,
    path: RouteConst.TRANSACTIONS_MANAGER,
    name: 'Transactions',
    isMenu: true,
    icon: IconTransaction,
    exact: true,
    permission: [permissions.FIND_TRANSACTION],
  },
  {
    component: BroadcastsManage,
    path: RouteConst.BROADCASTS_MANAGER,
    name: 'Broadcasts',
    isMenu: true,
    icon: IconBroadcasts,
    exact: true,
    permission: [permissions.CREATE_BROADCAST],
  },

];

export default RouterMenu;