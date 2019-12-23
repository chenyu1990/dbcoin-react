import { Badge, Button, Card, Col, Form, Input, Radio, Row, Select, Tag, Tooltip } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import moment from 'moment';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['processing', 'success'];
const status = ['未到账', '已到账'];

const coinTypeColor = ['', '#f69736', '#179f76'];
const coinType = ['', 'BTC', 'USDT'];
const categoryColor = ['', 'blue', 'gold', 'orange', 'magenta', 'lime'];
const category = ['', 'send', 'receive', 'generate', 'immature', 'orphan'];

/* eslint react/no-multi-comp:0 */
@connect(({ user, profile, transactionBlock, loading }) => ({
  user,
  profile,
  transactionBlock,
  loading: loading.models.transactionBlock,
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
      title: '币类型',
      dataIndex: 'coin_type',
      render(val) {
        return <Tag color={coinTypeColor[val]}>{coinType[val]}</Tag>;
      },
    },
    {
      title: '交易分类',
      dataIndex: 'category',
      render(val) {
        return <Tag color={categoryColor[val]}>{category[val]}</Tag>;
      },
    },
    {
      title: '收款人',
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
      title: '交易ID',
      dataIndex: 'tx_id',
      ellipsis: true,
      render: val => (
        <Tooltip placement="topLeft" title={val}>
          <span>{val}</span>
        </Tooltip>
      ),
    },
    {
      title: '发件人地址',
      dataIndex: 'address',
      ellipsis: true,
      render: val => (
        <Tooltip placement="topLeft" title={val}>
          <span>{val}</span>
        </Tooltip>
      ),
    },
    {
      title: '收件人地址',
      dataIndex: 'address',
      ellipsis: true,
      render: (_, record) => {
        const {
          profile: { profiles },
        } = this.props;
        if (profiles[record.record_id]) {
          const addressField = record.coin_type === 2 ? 'usdt' : 'btc';
          const address = profiles[record.record_id][`${addressField}_address`];
          return (
            <Tooltip placement="topLeft" title={address}>
              <span>{address}</span>
            </Tooltip>
          );
        }
        return null;
      },
    },
    {
      title: '发生额',
      dataIndex: 'amount',
    },
    {
      title: '手续费',
      dataIndex: 'fee',
    },
    {
      title: '确认次数',
      dataIndex: 'confirmations',
    },
    {
      title: '到账状态',
      dataIndex: 'status',

      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '交易时间',
      dataIndex: 'time',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
  ];

  fetchUser = ({ response, data }) => {
    const { dispatch } = this.props;
    if (response.status === 200) {
      let users = [];
      data.list.map(item => {
        if (users.indexOf(item.record_id) === -1) {
          users.push(item.record_id);
        }
      });
      dispatch({
        type: 'profile/fetch',
        payload: {
          record_ids: users.join(','),
        },
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
      type: 'transactionBlock/fetch',
      callback: this.fetchUser,
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
      type: 'transactionBlock/fetch',
      payload: params,
      callback: this.fetchUser,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'transactionBlock/fetch',
        payload: values,
        callback: this.fetchUser,
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
      type: 'transactionBlock/fetch',
      callback: this.fetchUser,
    });
  };

  renderSearchForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="真实姓名">
              {getFieldDecorator('like_real_name')(<Input placeholder='支持模糊匹配' />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="昵称">
              {getFieldDecorator('like_nick_name')(<Input placeholder='支持模糊匹配' />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="手机号">
              {getFieldDecorator('like_phone')(<Input placeholder="支持模糊匹配" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="交易类型">
              {getFieldDecorator('category', {
                initialValue: 2,
              })(
                <Select
                  style={{
                    width: '100%',
                  }}
                  placeholder="请选择交易类型"
                >
                  {category
                    ? category.map((item, index) => {
                      if (item === '') return <Select.Option value={null}>全部</Select.Option>;
                      return <Select.Option value={index}>{item}</Select.Option>;
                    })
                    : null}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="状态">
              {getFieldDecorator('status')(
                <Radio.Group>
                  <Radio value={-1}>全部</Radio>
                  <Radio value={0}>未到账</Radio>
                  <Radio value={1}>已到账</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button onClick={this.handleFormReset}
                      style={{ marginLeft: 8 }}
              >重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      transactionBlock: { data },
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
