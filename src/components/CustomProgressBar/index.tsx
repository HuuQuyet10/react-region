import React, {useEffect, useState} from 'react';
import {ProgressProps, Progress} from "antd";
import {UploadOutlined} from '@ant-design/icons';
import './style.scss';

interface CustomProgressBarProps extends ProgressProps {
  fileName: string;
  percent: number;
}

const CustomProgressBar = (props: CustomProgressBarProps) => {

  const {fileName, percent} = props;

  return (
      <div className="customProgressBar">
        <Progress
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          percent={percent}
        />
        <div className="fileName">{fileName}</div>
      </div>
  );
};

export default CustomProgressBar;
