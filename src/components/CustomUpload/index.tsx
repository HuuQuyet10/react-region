import React, {useEffect, useState} from 'react';
import {Button, Upload, UploadProps, Progress} from "antd";
import {Storage} from "@aws-amplify/storage";
import {UploadOutlined} from '@ant-design/icons';
import {FileUpload} from "../../models";
import CustomProgressBar from '../CustomProgressBar';

interface CustomUploadProps extends UploadProps {
  onComplete: (uploadedKey: string) => void;
}

const CustomUpload = (props: CustomUploadProps) => {

  const {multiple, onComplete, disabled} = props;

  const [isDisable, setIsDisable] = useState(disabled || false);
  const [fileList, setFileList] = useState<string>();
  const [percentUpload, setPercentUpload] = useState<number>(0);
  const [curFileName, setCurFileName] = useState<string>('');

  const uploadProps: UploadProps = {
    async customRequest({
      action,
      data,
      file,
      filename,
      headers,
      onError,
      onProgress,
      onSuccess,
      withCredentials
    }) {
      // try {

      setIsDisable(true);
      setCurFileName(file['name']);

      const aaa = await Storage.put(file['name'], file, {
        resumable: true,
        progressCallback: (progress) => {
          // console.log('file Storage.put', file)
          // console.log(`Uploaded: ${progress.loaded/progress.total*100}%`);

          const percent = Number((progress.loaded/progress.total*100).toFixed(0));
          // onProgress: progress => percent

          console.log('progress', progress)
          setPercentUpload(percent)
        },
        completeCallback: event => {
          console.log(`Successfully uploaded ${event.key}`);
          setTimeout(() => {
            setIsDisable(false);
            setPercentUpload(0);
            onComplete(event.key);
          }, 1000)
          // return event.key;
        },
      });

      console.log('aaa', aaa)
      // } catch (error) {
      //   console.log('Error uploading file: ', error);
      // }
    },

    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 4,
      format: percent => percentUpload && `${percentUpload}%`,
    },
  };

  useEffect(() => {
    setIsDisable(disabled || false)
  }, [disabled]);

  const cancelUpload = (upload) =>{
    Storage.cancel(upload);
  };

  return (
    <>
      <div>
      <Upload
        {...uploadProps}
        multiple={false}
        disabled={isDisable}
        showUploadList={false}
      >
        <Button disabled={isDisable} icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
        {(isDisable && percentUpload) ?
          <CustomProgressBar fileName={curFileName} percent={percentUpload} />
          : <></>
        }

      </div>
    </>
  );
};

export default CustomUpload;
