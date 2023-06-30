import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import {OptionModel} from "../../models";
import {Popconfirm, Select, SelectProps} from "antd";

interface Props extends SelectProps<any> {
  data: OptionModel[],
  confirmMessage: string,
  onConfirm: any,
  onCancel?: any,
  availableStatus?: any,
  disabledStatus?: any[],
};
const {Option} = Select;
const SelectConfirm = ({data,confirmMessage, onConfirm, onCancel, availableStatus, disabledStatus, ...rest}: Props) => {

  const [show, setShow] = useState(false);
  const [valueChange, setValueChange] = useState<any>();
  const [selectedObj, setSelectedObj] = useState<any>();

  const confirmChange = () => {
    onConfirm(valueChange);
    setShow(false);
  };

  const cancelChange = () => {
    if (_.isFunction(onCancel)){
      onCancel();
    }
    setShow(false);
  };

  const onChangeSelect = (valueChange) => {
    setValueChange(valueChange);
    setShow(true);
    const selectedItem = data.find((x: OptionModel) => x.value == valueChange);
    setSelectedObj(selectedItem);
  };


  const onFirstChange = (e) => {
    //on change lần đầu chưa có value thì ko cần hiện pop confirm
    onConfirm(e);
  };

  const onVisibleChange = () => {
    if (show){
      cancelChange();
    }
  };

  const preventClick = (e) => {
    e.stopPropagation();
  };

  const getConfirmMsg = () => {
      const aa = confirmMessage.replace('%%NAME%%', selectedObj?.label);
      return aa;
  };

  return (
    <>
      <div onClick={preventClick}>
        {rest.value ?
          <Popconfirm
            placement="topLeft"
            title={getConfirmMsg}
            onConfirm={confirmChange}
            onCancel={cancelChange}
            okText="Yes"
            cancelText="No"
            open={show}
            onOpenChange={onVisibleChange}
            overlayClassName="confirmSelect"
          >
            <Select {...rest}
                    onChange={onChangeSelect}>
              {data.map((d: OptionModel) => {
                let disable = false;
                if (disabledStatus && disabledStatus.includes(d.value)) {
                  disable = true;
                }
                return (
                  <Option key={d.value} value={d.value} hidden={d.value==0} disabled={disable}>
                    <span>{d.label}</span>
                  </Option>
                )
              })}
            </Select>
          </Popconfirm>
          :
          <Select {...rest}
                  onChange={onFirstChange}>
            {data.map((d: OptionModel) => {
              let disable = false;
              if (disabledStatus && disabledStatus.includes(d.value)) {
                disable = true;
              }
              return (
                <Option key={d.value} value={d.value} hidden={d.value==0} disabled={disable}>
                  <span>{d.label}</span>
                </Option>
              )
            })}
          </Select>
        }

      </div>
    </>
  );
};

export default SelectConfirm;
