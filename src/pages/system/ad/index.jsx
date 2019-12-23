import { Modal, Button, Card, Upload, Form, Switch, Icon, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import * as API from '@/api';
import store from '@/utils/store';

const { confirm } = Modal;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ ad, loading }) => ({
  ad,
  loading: loading.models.ad,
}))
class TableList extends Component {
  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '排序',
      dataIndex: 'display_order',
    },
    {
      title: '图像',
      dataIndex: 'image',
      render: (val, record) => {
        const { token_type, access_token } = store.getAccessToken();
        return (
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            name="file"
            headers={{
              authorization: `${token_type} ${access_token}`,
            }}
            action={API.ATTACHMENT.MAIN}
            onChange={obj => this.handleFileChange(obj, record)}
          >
            {val ? (
              <img src={`${API.DATA.ATTACHMENT}/${val}`} alt="banner" style={{ width: '100%' }} />
            ) : (
              <Fragment>
                <Icon type={record.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传</div>
              </Fragment>
            )}
          </Upload>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',

      render: (val, record) => {
        return (
          <Switch
            checkedChildren="正常"
            unCheckedChildren="关闭"
            onChange={() => {
              this.handleSwitchBannerStatus(record);
            }}
            checked={record.status === 1}
          />
        );
      },
    },
    {
      title: '操作',
      render: (_, record) => (
        <Fragment>
          <a
            style={{ color: 'red' }}
            onClick={() => {
              confirm({
                title: `确认删除这张广告图？[ID: ${record.id}]`,
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                onOk: () => {
                  const { dispatch } = this.props;
                  dispatch({
                    type: 'ad/remove',
                    payload: record,
                  });
                },
              });
            }}
          >
            删除
          </a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/fetch',
    });
  }

  handleFileChange = ({ file }, record) => {
    switch (file.status) {
      case 'error':
        message.error(`${file.name} 上传失败`);
        break;
      case 'uploading':
        record.loading = true;
        this.handleUpdateLoading(record);
        break;
      case 'done':
        message.success(`${file.name} 上传成功`);
        const {
          response: { image: data },
        } = file; // attachment 表的 image 字段，应该改为data字段
        record.loading = false;
        record.image = data;
        this.handleUpdate(record);
        break;
    }
  };
  handleSwitchBannerStatus = record => {
    const { dispatch } = this.props;
    let type;
    if (record.status === 1) {
      type = 'ad/disable';
      record.status = 2;
    } else {
      type = 'ad/enable';
      record.status = 1;
    }
    dispatch({
      type: type,
      payload: record,
    });
  };
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'ad/fetch',
      payload: params,
    });
  };

  handleAdd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/add',
    });
  };
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/update',
      payload: fields,
    });
  };
  handleUpdateLoading = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/updateLoading',
      payload: fields,
    });
  };

  render() {
    const {
      ad: { data },
      loading,
    } = this.props;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleAdd}>
                新建
              </Button>
            </div>
            <StandardTable
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
