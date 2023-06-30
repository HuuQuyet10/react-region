import React, {useEffect, useState} from 'react';
import {CaretDownFilled} from '@ant-design/icons';
import {OptionModel} from "../../models";
import _ from 'lodash';
import {SelectProps} from "antd/es/select";
import {Select} from "antd";

const {Option} = Select;

export interface PropsSelect extends SelectProps<any>{
  data: OptionModel[];
  notFoundContent?: any;
  disableOptions?: any;
  onApiSearch?: (keyword) => void;
  onLoadmore?: (keyword) => void;
  isApiSearch?: boolean;
  isFull?: boolean;
}

const SelectOption = ({...props}: PropsSelect) => {
  const {
    data,
    loading,
    disableOptions,
    showSearch,
    isApiSearch,
    onApiSearch,
    onLoadmore,
    isFull,
    ...rest
  } = props;

  const [optionDisplay, setOptionDisplay] = useState<OptionModel[]>(data);
  const [keySearch, setKeySearch] = useState('');

  useEffect(() => {
    setOptionDisplay(data)
  }, [data]);

  // useEffect(() => {
  //   console.log('rest.value', rest.value)
  // }, [rest.value]);


  const onSearchFn = _.debounce((keyword) => {

    if (!isApiSearch){
      if (keyword){
        const resultSearch = optionDisplay.filter((item: OptionModel) => {
          return item.label.toLocaleLowerCase().includes(keyword)
        });
        setOptionDisplay(resultSearch);
      } else {
        setOptionDisplay(data)
      }
    } else {
      // @ts-ignore
      onApiSearch && onApiSearch(keyword);
    }
    setKeySearch(keyword);

  }, 300);

  const onFilter = (input, option) => {
    // lọc các option trong select theo label, ko cần customize search, component này có cả local và api search nên dùng cái search kia luôn, ko cần dùng filterOption
    return option.children.props.children.toLowerCase().includes(input.toLowerCase());
  };


  const onScroll = e => {
    const popup = e.target;
    if (popup.scrollHeight - (popup.scrollTop + 257) < 50){ // do scrollTop max = scrollHeight - 257 (đã test chính xác), nên để scroll với đk này
      if(!loading && !isFull && _.isFunction(onLoadmore)){
        // @ts-ignore
        onLoadmore(keySearch)
      } // nếu selectbox làm loadmore thì bắt buộc phải có kèm isFull để check xem load hết item chưa, và loading để đang loading thì scroll ko gọi api nữa
    }
  };

  return (
    <Select
      {...rest}
      showSearch={showSearch}
      //@ts-ignore
      onSearch={showSearch ? onSearchFn : null}
      // filterOption={onFilter}
      filterOption={false}
      onPopupScroll={onScroll}
      allowClear
    >
      {optionDisplay.map((d: OptionModel, index) => {
        let disable = false;
        if (disableOptions && disableOptions.includes(d.value)) {
          disable = true;
        }

        return (
          <Option key={index} value={d.value} disabled={disable}>
            <span style={{color: d?.color}}>{d.label}</span>
          </Option>
        );
      })}

    </Select>
  );
};

export default React.memo(SelectOption);
