import { Button, Form, Icon, Input, message, Upload } from 'antd';
import React from 'react';
import * as API from '@/api';
import store from '@/utils/store';

const InputFile = props => {
  const { onChange, value } = props;
  const { token_type, access_token } = store.getAccessToken();

  const handleFileChange = ({ file, fileList }) => {
    switch (file.status) {
      case 'error':
        message.error(`${file.name} 上传失败`);
        break;
      case 'done':
        message.success(`${file.name} 上传成功`);
        const {
          response: { image: data },
        } = file; // attachment 表的 image 字段，应该改为data字段
        onChange(data);
        break;
    }
  };

  return (
    <React.Fragment>
      <Input value={value} onChange={onChange} />
      <Upload
        name="file"
        headers={{
          authorization: `${token_type} ${access_token}`,
        }}
        action={API.ATTACHMENT.MAIN}
        onChange={handleFileChange}
      >
        <Button>
          <Icon type="upload" />
          上传媒体
        </Button>
      </Upload>
    </React.Fragment>
  );
};

export default Form.create()(InputFile);
