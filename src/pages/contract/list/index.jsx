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
  Tooltip,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';
import store from '@/utils/store';
import * as API from '@/api';
import moment from 'moment';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['error', 'processing', 'default', 'warning', 'error'];
const status = ['未知状态', '正常', '售罄', '下架', '开始分红'];
const machineStatusMap = ['default', 'processing', 'error'];
const machineStatus = ['待运行', '正在运行', '停止运行'];

/* eslint react/no-multi-comp:0 */
@connect(({ contract, loading }) => ({
  contract,
  loading: loading.models.contract,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };
  columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '图像',
      dataIndex: 'thumb',
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
      title: '合约名称',
      dataIndex: 'name',
      render: (val, recode) => (
        <Tooltip placement="topLeft" title={recode.summary}>
          <span>{val}</span>
        </Tooltip>
      ),
    },
    {
      title: '算力',
      dataIndex: 'power',
      align: 'right',
      render: val => `${val} T/s`,
    },
    {
      title: '状态',
      dataIndex: 'status',

      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '矿机状态',
      dataIndex: 'machine_status',

      render(val) {
        return <Badge status={machineStatusMap[val]} text={machineStatus[val]} />;
      },
    },
    {
      title: '售卖情况',
      dataIndex: 'sale_percent',
      render: (val, record) => (
        <Progress
          percent={val ? val.toFixed(1) : 0}
          type="circle"
          format={() => `${record.sale_count}/${record.total}`}
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
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/fetch',
    });
  }

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
        const {
          response: { image, thumb },
        } = file; // attachment 表的 image 字段，应该改为data字段
        record.loading = false;
        record.image = image;
        record.thumb = thumb;
        this.handleUpdate(record);
        break;
    }
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
      type: 'contract/fetch',
      payload: params,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'contract/add',
      payload: fields,
    });
    this.handleModalVisible();
  };
  handleUpdate = fields => {
    const { dispatch } = this.props;
    this.fixTypeof(fields);
    dispatch({
      type: 'contract/update',
      payload: fields,
    });
    this.handleUpdateModalVisible();
  };

  fixTypeof = fields => {
    fields.id = Number(fields.id);
    fields.total = Number(fields.total);
    fields.sale_count = Number(fields.sale_count);
    fields.power = Number(fields.power);
    fields.usdt_fee = Number(fields.usdt_fee);
    fields.got_point = Number(fields.got_point);
    fields.got_ttc = Number(fields.got_ttc);
    fields.status = Number(fields.status);
    fields.machine_status = Number(fields.machine_status);
    fields.sale_percent = Number(fields.sale_percent);
  };

  render() {
    const {
      contract: { data },
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible, stepFormValues } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
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
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
