import { Badge, Button, Card, Form } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['processing', 'success'];
const status = ['待分红', '已分红'];
/* eslint react/no-multi-comp:0 */
@connect(({ contract, contractPlan, loading }) => ({
  contract,
  contractPlan,
  loading: loading.models.contractPlan,
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
      title: '合约ID',
      dataIndex: 'contract_id',
      render: val => {
        const { contract: { data: { list } } } = this.props;
        const contract = list.find(contract => contract.id === val);
        return contract ? contract.name : val;
      },
    },
    {
      title: 'BTC分红基数',
      dataIndex: 'btc_base',
      render: val => val.toFixed(8),
    },
    {
      title: '分红日期',
      dataIndex: 'date',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
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
      type: 'contractPlan/fetch',
    });
    dispatch({
      type: 'contract/fetch',
    });
  }

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
      type: 'contractPlan/fetch',
      payload: params,
    });
  };

  handleModalVisible = flag => {
    const {
      contract: { data },
    } = this.props;
    this.setState({
      modalVisible: !!flag,
      contractList: data.list,
    });
  };
  handleUpdateModalVisible = (flag, record) => {
    const {
      contract: { data },
    } = this.props;
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
      contractList: data.list,
    });
  };
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'contractPlan/add',
      payload: fields,
    });
    this.handleModalVisible();
  };
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'contractPlan/update',
      payload: fields,
    });
    this.handleUpdateModalVisible();
  };

  render() {
    const {
      contractPlan: { data },
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible, stepFormValues, contractList } = this.state;
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
              <span>矿机分红时间为凌晨3点及5点。5点为二次校验，避免3点的分红没有分</span>
            </div>
            <StandardTable
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm contractList={contractList} {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            select={contractList}
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
