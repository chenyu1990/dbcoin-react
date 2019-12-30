import {
  Badge,
  Button,
  Card,
  Col,
  Row,
  Form,
  Icon,
  message,
  Progress,
  Upload,
  Tooltip, Tag,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import StandardTable from './components/StandardTable';
import { FormattedMessage } from 'umi-plugin-react/locale';

import Editor from './components/Editor';

import styles from './style.less';
import store from '@/utils/store';
import * as API from '@/api';
import moment from 'moment';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['error', 'processing', 'default'];
const status = ['未知状态', '正常', '售罄'];

const coinTypeColor = ['', '#179f76', '#121212'];
const coinType = ['', 'USDT(omni)', 'ETH'];

/* eslint react/no-multi-comp:0 */
@connect(({ contract, loading }) => ({
  contract,
  loading: loading.models.contract,
}))
class TableList extends Component {
  state = {
    editModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };
  columns = [
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
            data={{
              cat_id: 5,
              related_id: record.id,
              width: 100,
              height: 100,
            }}
            action={`${API.CONTRACT.MAIN}/upload/${record.contract_id}`}
            onChange={obj => this.handleFileChange(obj, record)}
          >
            {val ? (
              <img src={`${API.DATA.Contract}/${val}`} alt="banner" style={{ width: '100%' }} />
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
      title: '合约名称',
      dataIndex: 'name',
      render: (val, recode) => (
        <Tooltip placement="topLeft" title={recode.summary}>
          <span>{val}</span>
        </Tooltip>
      ),
    },
    {
      title: '币类型',
      dataIndex: 'coin_type',
      render(val) {
        return <Tag color={coinTypeColor[val]}>{coinType[val]}</Tag>;
      },
    },
    {
      title: '期数',
      dataIndex: 'period',
    },
    {
      title: '价格',
      dataIndex: 'price',
    },
    {
      title: '分红状态',
      dataIndex: 'dividend_status',

      render(val) {
        return val === 1 ? '已分' : '';
      },
    },
    {
      title: '售卖情况',
      dataIndex: 'sale_percent',
      render: (val, record) => (
        <Progress
          percent={val ? val.toFixed(1) : 0}
          type="circle"
          format={() => `${record.sold}/${record.total}`}
          width={100}
        />
      ),
    },
    {
      title: '起止时间',
      render: (_, record) => {
        return (
          <Row>
            <Col>起：{moment(record.sale_time_bgn).format('YYYY-MM-DD HH:mm:ss')}</Col>
            <Col>止：{moment(record.sale_time_end).format('YYYY-MM-DD HH:mm:ss')}</Col>
          </Row>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/fetch',
    });
  }

  fetch = (formValues, reset) => {
    const { dispatch } = this.props;
    let payload = {};
    if (typeof reset === 'undefined' || reset !== true) {
      const { pagination, formValues: oldFormValues } = this.state;
      formValues = { ...oldFormValues, ...formValues };
      payload = {
        ...pagination,
        ...formValues,
      }
    } else {
      payload = formValues;
    }
    dispatch({
      type: 'contract/fetch',
      payload,
      success: () => this.setState({ formValues, selectedRows: [] }),
    });
  };

  handleUpdateLoading = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/updateLoading',
      payload: fields,
    });
  };

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
        this.fetch();
        break;
    }
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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

    this.fetch(params);
  };

  handleEditModalVisible = flag => {
    this.setState({
      editModalVisible: !!flag,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleEdit = fields => {
    const { formType } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: formType === 'E' ? 'contract/update' : 'contract/add',
      payload: fields,
      success: () => {
        this.fetch();
        this.handleEditModalVisible();
      },
    });
  };

  handleEditClick = formType => {
    if (formType === 'E') {
      const { selectedRows } = this.state;
      const { dispatch } = this.props;
      dispatch({
        type: 'contract/get',
        payload: selectedRows[0],
        success: data => {
          this.setState({
            editModalVisible: true,
            formType,
            stepFormValues: data,
          });
        }
      });
    } else {
      this.setState({
        editModalVisible: true,
        formType,
      });
    }
  };

  render() {
    const {
      contract: { data },
      loading,
    } = this.props;
    const { selectedRows, editModalVisible, formType, stepFormValues } = this.state;
    const parentMethods = {
      handleEdit: this.handleEdit,
      handleEditModalVisible: this.handleEditModalVisible,
      formType,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleEditClick('A')}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <React.Fragment>
                  {selectedRows.length === 1 ?
                    <Button onClick={() => this.handleEditClick('E')}>
                      <Icon type='edit'/>
                      <FormattedMessage id='component.operation.edit' />
                    </Button> : null}
                </React.Fragment>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Editor {...parentMethods} editModalVisible={editModalVisible}
                    values={stepFormValues}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
