import {apiInstance} from "../../../services/api";
import ApiConstants from "../../../constants/endpoint";

// services
export const socketAPI = async (params: {token: string}) => {

  const result = await apiInstance.get(ApiConstants.API_ENDPOINT_SOCKET, {params: params});
  return result;
};












