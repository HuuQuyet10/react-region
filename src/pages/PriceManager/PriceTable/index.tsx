import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, InputNumber, Modal, ProgressProps, Row, Table, Tooltip} from "antd";
import {useSelector} from "react-redux";
import {convertCurrency, formatNumberVNI} from "../../../utils";
import _ from "lodash";
import PriceServices from "../../../core/priceManage/services";
import {GetPriceByCustomerResponse, PriceItemByJobType} from "../../../core/priceManage/models";
import {JobTypeItemResponse} from "../../../core/jobType/models";
import {getJobTypeListSelector} from "../../../core/jobType/selectors";
import {UserDetailResponse} from "../../../core/user/models";
import numeral from 'numeral';

interface PriceTableProps {
  customer: UserDetailResponse;
}

function PriceTable (props: PriceTableProps){

  const {customer} = props;

  const {data: jobTypeList} = useSelector(getJobTypeListSelector);

  const [listPrice, setListPrice] = useState<PriceItemByJobType[]>([]);
  const [listPriceWithJobType, setListWithJobType] = useState<any[]>([]);
  const [customerJobType, setCustomerJobType] = useState<JobTypeItemResponse[]>([]);

  useEffect(() => {
    if(!_.isEmpty(customer)){
      getPriceByCustomer(customer.id);
    }

  }, [customer]);

  const getPriceByCustomer = async customerId => {
    const resultPrice = (await PriceServices.getDetailPriceByCustomerAPI(customerId)).data;
    if (!_.isEmpty(resultPrice)){
      const result: GetPriceByCustomerResponse = resultPrice[0];
      const priceList = result.prices;
      setListPrice(priceList);
    }
  };

  useEffect(() => {
    if (!_.isEmpty(jobTypeList)){

      const customerJobType = jobTypeList.filter((item: JobTypeItemResponse) => customer.jobTypes.includes(item.id));
      setCustomerJobType(customerJobType);

    }
  }, [jobTypeList]);

  useEffect(() => {
    if (!_.isEmpty(listPrice) && !_.isEmpty(customerJobType)){

      const aaa = listPrice.map((item: PriceItemByJobType) => {
        const curJobType = customerJobType.find((itemChild: JobTypeItemResponse) => itemChild.id === item.jobTypeId);
        return {...curJobType, price: item.unitPrice};
      });


      setListWithJobType(aaa);

    }
  }, [listPrice]);

  const TablePrice = () => {
    return <>

      <Row gutter={40}>
        {_.map(listPriceWithJobType, (item, index) => {
          return <React.Fragment key={item.id}>
            <Col xs={12} sm={12} md={8}>
              <div style={{display:'flex', justifyContent: "space-between"}}>
                <span>{item.name}:</span>
                {/*<span>{convertCurrency(item.price)}</span>*/}
                <span>{formatNumberVNI(item.price)}</span>
              </div>
            </Col>
          </React.Fragment>
        })}
      </Row>

      </>
  }

  return (
    <>
      <div className="tablePriceByUser">
        {!_.isEmpty(listPrice) ?
        <>
          <TablePrice />
        </> :
          <>
            Price for this customer has been not setup!
          </>
        }

      </div>

    </>
  )

}


export default PriceTable;