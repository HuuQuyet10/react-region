import React, { forwardRef, useEffect, useState } from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

type Props = InputProps & {
  showPassword: boolean;
  autoComplete?: string;
  setshowPassword: any;
};

const InputPassword = forwardRef((props: Props, ref: any) => {

  const { showPassword, setshowPassword, ...rest } = props;

  useEffect(() => {
    setshowPassword(showPassword);
  }, [showPassword]);

  const getIcon = () => {
    if (showPassword) {
      return <EyeOutlined onClick={() => setshowPassword(!showPassword)} />;
    }
    return <EyeInvisibleOutlined onClick={() => setshowPassword(!showPassword)} />;
  };



  return <Input {...rest} ref={ref} type={showPassword ? 'input' : 'password'} suffix={getIcon()} />;
});

export default InputPassword;
