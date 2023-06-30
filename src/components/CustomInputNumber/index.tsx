import React, {useEffect, useState} from "react";
import numeral from 'numeral';
import { InputNumber } from 'antd';
import {InputNumberProps} from "antd/lib/input-number";


interface Props extends InputNumberProps{
  onChange?: (value) => void;
}

const CustomInputNumber = (props: Props) => {

  const {onChange} = props;

  const formatter = (value) => {
    if (value === null || value === undefined) {
      return '';
    }

    let decimalPlaces = 0;
    if (value.toString().includes('.')) {
      decimalPlaces = value.toString().split('.')[1].length;
    }

    if (decimalPlaces === 0) {
      return numeral(value).format('0,0');
    } else if (decimalPlaces === 1) {
      return numeral(value).format('0,0.[0]');
    } else {
      return numeral(value).format('0,0.[00]');
    }
  };


  return (
    <InputNumber
      {...props}
      // onChange={onChange}
      formatter={formatter}
      parser={(value) => value ? numeral(value).value() : undefined}
    />
  );
};

export default CustomInputNumber;
