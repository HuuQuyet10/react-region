import React, {ReactNode} from 'react';
import { Popover, Button, Space, Typography, Tooltip } from 'antd';
import { DeleteOutlined, ExclamationCircleFilled, CloseCircleOutlined } from '@ant-design/icons';

import './style.scss';
import { PopoverProps } from 'antd/lib/popover';
import { ButtonProps } from 'antd/lib/button';
import { title } from 'process';

const { Paragraph } = Typography;
type Props = PopoverProps &
  ButtonProps & {
    text?: string | ReactNode;
    title?: string;
  };
class DeleteConfirmPopover extends React.Component<Props, any> {
  constructor(props) {
    super(props);

    this.state = {
      popoverVisible: false,
      tooltipVisible: false,
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick = record => {
    this.setState({
      popoverVisible: false,
      tooltipVisible: false,
    });
    if (this.props.onClick) {
      this.props.onClick(record);
    }
  };

  render(): React.ReactNode {
    const { popoverVisible, tooltipVisible } = this.state;
    const { text, icon, disabled, title } = this.props;

    const content = (
      <div className="delete-confirm-popover">
        <Paragraph>
          <ExclamationCircleFilled style={{ color: '#FAAD15' }} />
          {text}
        </Paragraph>
        <Space>
          <Button size="small" type="default" onClick={() => this.setState({ popoverVisible: false })}>
            No
          </Button>
          <Button size="small" type="primary" onClick={this.onClick} disabled={disabled}>
            Yes
          </Button>
        </Space>
      </div>
    );

    return (
      <Popover
        placement="topRight"
        content={content}
        trigger="click"
        open={popoverVisible && !disabled}
        onOpenChange={visible => this.setState({ popoverVisible: visible, tooltipVisible: false })}
      >
        <Tooltip
          title={title || 'Delete'}
          open={popoverVisible ? false : tooltipVisible}
          onOpenChange={visible => this.setState({ tooltipVisible: visible })}
        >
          <Button type="link" icon={icon == 'x' ? <CloseCircleOutlined /> : <DeleteOutlined />} disabled={disabled} />
        </Tooltip>
      </Popover>
    );
  }
}

export default DeleteConfirmPopover;
