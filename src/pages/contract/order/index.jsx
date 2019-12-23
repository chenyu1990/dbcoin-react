import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Row,
  Select,
  Tag,
  Input, message, DatePicker,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
let moment = require('moment-timezone');
import StandardTable from './components/StandardTable';
import styles from './style.less';
const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'success', 'error'];
const status = ['未知状态', '有效合约', '无效合约'];

/* eslint react/no-multi-comp:0 */
@connect(({ user, profile, contract, contractOrder, loading }) => ({
  user,
  profile,
  contract,
  contractOrder,
  loading: loading.models.contractOrder,
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
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '合约名称',
      dataIndex: 'name',
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
      title: '购买份数',
      dataIndex: 'count',
    },
    {
      title: 'USDT费用',
      dataIndex: 'usdt_fee',
    },
    {
      title: '获得TTC',
      dataIndex: 'got_ttc',
    },
    {
      title: '获得积分',
      dataIndex: 'got_point',
    },
    {
      title: '合约状态',
      dataIndex: 'status',

      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '购买时间',
      dataIndex: 'created_at_utc',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    /*
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
        </Fragment>
      ),
    },*/
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
      type: 'contract/fetch',
    });
    dispatch({
      type: 'contractOrder/fetch',
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
      type: 'contractOrder/fetch',
      payload: params,
      callback: this.fetchUser,
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'contractOrder/fetch',
      payload: {},
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        created_at_bgn: fieldsValue.created_at_bgn && fieldsValue.created_at_bgn.format(),
        created_at_end: fieldsValue.created_at_end && fieldsValue.created_at_end.format(),
      };
      console.log('debug order excel', values);
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'contractOrder/fetch',
        payload: values,
      });
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

  handleGenerateExcel = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        created_at_bgn: fieldsValue.created_at_bgn && fieldsValue.created_at_bgn.format(),
        created_at_end: fieldsValue.created_at_end && fieldsValue.created_at_end.format(),
      };
      console.log('debug order excel', values);
      dispatch({
        type: 'contractOrder/generateExcel',
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
      type: 'contractOrder/getExcel'
    });
  };

  renderSearchForm() {
    const { form, contract: { data: { list: contract } } } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="合约">
              {form.getFieldDecorator('contract_ids')(
                <Select
                  mode="tags"
                  style={{
                    width: '100%',
                  }}
                  placeholder="请选择合约"
                >
                  {contract
                    ? contract.map(item => {
                        return <Option key={item.id.toString()} value={item.id.toString()}>{item.name}</Option>;
                    })
                    : null}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="真实姓名">
              {getFieldDecorator('like_real_name')(<Input placeholder='支持模糊匹配' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="昵称">
              {getFieldDecorator('like_nick_name')(<Input placeholder='支持模糊匹配' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('like_phone')(<Input placeholder='支持模糊匹配' />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="起始时间">
              {getFieldDecorator('created_at_bgn')(<DatePicker
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
              {getFieldDecorator('created_at_end')(<DatePicker
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
      contractOrder: { data },
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
