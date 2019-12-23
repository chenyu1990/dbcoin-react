import {
  Card,
  Form,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ level, loading }) => {
  return {level,
    loading: loading.models.level,}
})
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
      title: '等级',
      dataIndex: 'level',
    },
    {
      title: '升级要求（直推等级）',
      dataIndex: 'downstream_level_count',
    },
    {
      title: '升级要求（推荐购买合约）',
      dataIndex: 'downstream_contract_total',
    },
    {
      title: '矿机BTC奖励比例',
      dataIndex: 'btc_percentage',
    },
    {
      title: '矿机USDT奖励比例',
      dataIndex: 'usdt_percentage',
    },
    {
      title: '矿机TTC奖励比例',
      dataIndex: 'ttc_percentage',
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
      type: 'level/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg)
      .reduce((obj, key) => {
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
      type: 'level/fetch',
      payload: params,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };
  handleUpdate = fields => {
    const { dispatch } = this.props;
    this.fixTypeof(fields);
    dispatch({
      type: 'level/update',
      payload: fields,
    });
    this.handleUpdateModalVisible();
  };

  fixTypeof = fields => {
    fields.id = Number(fields.id);
    fields.level = Number(fields.level);
    fields.downstream_level_count = Number(fields.downstream_level_count);
    fields.downstream_contract_total = Number(fields.downstream_contract_total);
    fields.btc_percentage = Number(fields.btc_percentage);
    fields.usdt_percentage = Number(fields.usdt_percentage);
    fields.ttc_percentage = Number(fields.ttc_percentage);
  };

  render() {
    const {
      level: { data },
      loading,
    } = this.props;
    const { updateModalVisible, stepFormValues } = this.state;
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              pagination={false}
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
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
