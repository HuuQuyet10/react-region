import {GenericObject} from "../../../@types/common";

export interface PermissionItem {
  id: number | string;
  name: string;
}

export interface CreateRole {
  name: string;
  permissions: Array<PermissionItem>;
};

export interface UpdateRole extends CreateRole{
  id: number;
};

export interface GetAllRoleModel {
  pageNumber: number;
  pageSize: number;
  sort?: string;
};


export interface RoleItemResponse {
  id: number,
  name: string,
  permissions: string[],
}