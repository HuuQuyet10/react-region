import React, {useEffect, useState} from 'react';
import {ProgressProps, Progress, Spin, Button} from "antd";
import {LoadingOutlined, UploadOutlined, DownloadOutlined, DeleteOutlined} from '@ant-design/icons';
import './style.scss';
import {getFileNameFromUrlDownload} from "../../utils";
import {Storage} from "@aws-amplify/storage";

interface CustomProgressBarProps extends ProgressProps {
  urlsDownload: string[];
}

const CustomFileDownload = (props: CustomProgressBarProps) => {

  const {urlsDownload} = props;
  const [isLoadingSpin, setIsLoadingSpin] = useState(false);
  const [loadingIndexDownload, setLoadingIndexDownload] = useState<number[]>([]);
  const [loadingIndexDelelte, setLoadingIndexDelelte] = useState<number[]>([]);

  const onRemoveFile = async (fileUrl, index) => {
    console.log(fileUrl)
    addLoadingDeleteIndex(index);

    try {
      const fileName = getFileNameFromUrlDownload(fileUrl);
      const resultDelete = await Storage.remove(fileName);
      console.log('resultDelete', resultDelete)
    } catch (e) {
      console.log('e resultDelete', e)
    }
    
    removeLoadingDeleteIndex(index)
  };


  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener('click', clickHandler);
      }, 150);
    };
    a.addEventListener('click', clickHandler, false);
    a.click();
    return a;
  }


  const onDownloadFile = async(fileUrl, index) => {
    console.log('onDownloadFile fileUrl', fileUrl)
    addLoadingDownloadIndex(index);
    const fileName = getFileNameFromUrlDownload(fileUrl);
    try{
      const resultDownload = await Storage.get(fileName, {
        download: true,
        progressCallback(progress) {
          console.log(`Downloaded: ${progress.loaded}/${progress.total}`);
        }
      });
      downloadBlob(resultDownload.Body, fileName);
    } catch (e) {
      console.log(e)
    }

    removeLoadingDownloadIndex(index)
  };

  const addLoadingDownloadIndex = (index: number) => {
    setLoadingIndexDownload([...loadingIndexDownload, index])
  };
  const removeLoadingDownloadIndex = (index: number) => {
    const result = loadingIndexDownload.filter(item => item != index);
    setLoadingIndexDownload(result);
  };

  const addLoadingDeleteIndex = (index: number) => {
    setLoadingIndexDelelte([...loadingIndexDelelte, index])
  };
  const removeLoadingDeleteIndex = (index: number) => {
    const result = loadingIndexDelelte.filter(item => item != index);
    setLoadingIndexDelelte(result);
  };

  return (
    <Spin spinning={isLoadingSpin} delay={300}>
      <div className="customFileDownload">
        <div className={'items'}>
          {urlsDownload?.map((item, index) => {
            const fileName = getFileNameFromUrlDownload(item);
            return <React.Fragment key={index}>
              <div className="item">

                <div className='fileName'>{fileName}</div>

                <div className='btnDownload'>
                  <Button type="primary" shape="round"
                          size="small"
                          loading={loadingIndexDownload.includes(index)}
                          disabled={loadingIndexDelelte.includes(index)} // đang delete thì disable download
                          onClick={() => onDownloadFile(item, index)}>
                    {loadingIndexDownload.includes(index) ?
                      <>Downloading</> :
                      <><DownloadOutlined /> Download</>
                    }
                  </Button>
                </div>

                {/*<div className='btnDelete'>*/}
                  {/*<Button type="primary" shape="round"*/}
                          {/*size="small"*/}
                          {/*loading={loadingIndexDelelte.includes(index)}*/}
                          {/*disabled={loadingIndexDownload.includes(index)} // đang download thì disable delete*/}
                          {/*onClick={() => onRemoveFile(item, index)}>*/}
                    {/*{loadingIndexDelelte.includes(index) ?*/}
                      {/*<></> :*/}
                      {/*<><DeleteOutlined /></>*/}
                    {/*}*/}
                  {/*</Button>*/}
                {/*</div>*/}

              </div>
            </React.Fragment>
          })}
        </div>
      </div>
    </Spin>
  );
};

export default CustomFileDownload;
