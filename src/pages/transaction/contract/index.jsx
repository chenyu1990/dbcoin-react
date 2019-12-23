import { Tag, Card, Col, Form, Row, Input, DatePicker, Button, message } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import StandardTable from './components/StandardTable';
import styles from './style.less';
let moment = require('moment-timezone');

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const earnType = [
  '未知状态',
  '购买合约收益',
  '推荐收益',
  '推荐级差收益',
  '充值',
  '持有合约收益(持币分红)',
  '矿机收益',
];

/* eslint react/no-multi-comp:0 */
@connect(({ user, transaction, profile, contract, loading }) => ({
  user,
  profile,
  contract,
  transaction,
  loading: loading.models.transaction,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };
  columns = [
    {
      title: '流水ID',
      dataIndex: 'id',
    },
    {
      title: '姓名|昵称',
      render: (_, record) => {
        const {
          profile: { profiles },
        } = this.props;
        if (profiles[record.record_id]) {
          return (
            <Row>
              <Col>
                <Tag color="#2db7f5">{profiles[record.record_id].real_name}</Tag>
              </Col>
              <Col>
                <Tag color="#87d068">{profiles[record.record_id].nick_name}</Tag>
              </Col>
            </Row>
          );
        }
        return null;
      },
    },
    {
      title: '联系电话',
      render: (_, record) => {
        const {
          user: { users },
        } = this.props;
        return <span>{users[record.record_id] ? users[record.record_id].phone : null}</span>;
      },
    },
    {
      title: '合约ID',
      dataIndex: 'contract_id',
      render: val => {
        const { contract: { data: { list } } } = this.props;
        if (val > 0 && list) {
          const contract = list.find(contract => contract.id === val);
          if (contract) {
            return contract.name;
          }
        }
      },
    },
    {
      title: '订单ID',
      dataIndex: 'order_id',
    },
    {
      title: '收益类型',
      dataIndex: 'earn_type',

      render: val => <span>{earnType[val]}</span>,
    },
    {
      title: 'USDT发生额',
      dataIndex: 'usdt',
      render: val => val.toFixed(8)
    },
    {
      title: 'BTC发生额',
      dataIndex: 'btc',
      render: val => val.toFixed(8)
    },
    {
      title: 'TTC发生额',
      dataIndex: 'ttc',
      render: val => val.toFixed(8)
    },
    {
      title: '积分',
      dataIndex: 'point',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '时间',
      dataIndex: 'created_at_utc',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
  ];

  fetchOtherData = ({ response, data }) => {
    const { dispatch } = this.props;
    if (response.status === 200) {
      let users = [];
      let ids = [];
      data.list.map(item => {
        const { record_id, contract_id } = item;
        if (users.indexOf(record_id) === -1) {
          users.push(record_id);
        }
        if (ids.indexOf(contract_id) === -1) {
          ids.push(contract_id)
        }
      });
      dispatch({
        type: 'profile/fetch',
        payload: {
          record_ids: users.join(','),
        },
      });
      dispatch({
        type: 'contract/fetch',
        payload: {
          ids,
        }
      });
      dispatch({
        type: 'user/fetch',
        payload: {
          record_ids: users.join(','),
        },
      });
    }
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'transaction/fetch',
      callback: this.fetchOtherData,
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
      type: 'transaction/fetch',
      payload: params,
      callback: this.fetchOtherData,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        bgn_time: fieldsValue.bgn_time && fieldsValue.bgn_time.format(),
        end_time: fieldsValue.end_time && fieldsValue.end_time.format(),
      };
      console.log('debug contract search', values);
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'transaction/fetch',
        payload: values,
        callback: this.fetchOtherData,
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'transaction/fetch',
      callback: this.fetchOtherData,
    });
  };

  handleGenerateExcel = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        bgn_time: fieldsValue.bgn_time && fieldsValue.bgn_time.format(),
        end_time: fieldsValue.end_time && fieldsValue.end_time.format(),
      };
      console.log('debug contract excel', values);
      dispatch({
        type: 'transaction/generateExcel',
        payload: values,
        success: () => {
          message.success('后台正在生成数据，稍等片刻后，点击获取表格')
        },
      });
    });
  };

  handleGetExcel = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'transaction/getExcel'
    });
  };

  renderSearchForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{
          md: 8,
          lg: 24,
          xl: 48
        }}>
          <Col md={8} sm={24}>
            <Form.Item label="真实姓名">
              {getFieldDecorator('like_real_name')(<Input placeholder='支持模糊匹配'/>)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="昵称">
              {getFieldDecorator('like_nick_name')(<Input placeholder='支持模糊匹配'/>)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="手机号">
              {getFieldDecorator('like_phone')(<Input placeholder="支持模糊匹配"/>)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="起始时间">
              {getFieldDecorator('bgn_time')(<DatePicker
                style={{
                  width: '100%',
                }}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择开始时间"
              />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="结束时间">
              {getFieldDecorator('end_time')(<DatePicker
                style={{
                  width: '100%',
                }}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="结束时间"
              />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }}
                      onClick={this.handleFormReset}>重置</Button>
              <Button style={{ marginLeft: 8 }}
                      type="dashed" htmlType="submit"
                      onClick={this.handleGenerateExcel}>生成表格</Button>
              <Button style={{ marginLeft: 8 }}
                      type="dashed" htmlType="submit"
                      onClick={this.handleGetExcel}>获取表格</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      transaction: { data },
      loading,
    } = this.props;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
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
