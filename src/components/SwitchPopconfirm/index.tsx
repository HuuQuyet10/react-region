import React, { useState } from 'react';
import { Popover, Switch, Space, Typography, Button } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { isFunction } from 'lodash';

import './style.scss';

const { Paragraph } = Typography;

const SwitchPopconfirm = (props: any) => {
  const [visible, setVisible] = useState<boolean>(false);

  const onSwitchClick = () => {
    if (props.disabled) {
      setVisible(false);
    } else if (isFunction(props.onClick)) {
      const result = props.onClick();
      setVisible(result);
    } else {
      setVisible(!visible);
    }
  };

  const onCancel = () => {
    setVisible(false);
  };

  const onVisibleChange = () => {
    if (visible){
      setVisible(false)
    }
  };

  const onOk = () => {
    setVisible(false);
    props.onOk();
  };

  const content = (
    <div className="switch-popconfirm" style={{ width: 265 }}>
      <Paragraph>
        <ExclamationCircleFilled style={{ color: '#FAAD15' }} />
        {props.text}
      </Paragraph>
      <Space>
        <Button size="small" type="default" onClick={onCancel}>
          No
        </Button>
        <Button size="small" type="primary" onClick={onOk}>
          Yes
        </Button>
      </Space>
    </div>
  );

  return (
    <Popover
      placement="bottomRight"
      content={content}
      trigger="click"
      onOpenChange={onVisibleChange}
      open={visible && !props.disabled}
      // getPopupContainer={() => document.getElementById('main-wrapper') as HTMLElement}
    >
      <Switch checked={props.checked} loading={props.loading} disabled={props.disabled} onClick={onSwitchClick} />
    </Popover>
  );
};

export default SwitchPopconfirm;
