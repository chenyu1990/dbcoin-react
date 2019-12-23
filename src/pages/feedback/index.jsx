import { Badge, Button, Card, Col, Form, Icon, Input, Radio, Row, Tag } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import moment from 'moment';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'success'];
const status = ['未知状态', '待处理', '已处理'];

/* eslint react/no-multi-comp:0 */
@connect(({ user, profile, feedback, loading }) => ({
  user,
  profile,
  feedback,
  loading: loading.models.feedback,
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
      title: '反馈内容',
      dataIndex: 'content',
    },
    {
      title: '反馈时间',
      dataIndex: 'created_at',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '审核状态',
      dataIndex: 'status',

      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
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
      type: 'feedback/fetch',
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
      type: 'feedback/fetch',
      payload: params,
      callback: this.fetchUser,
    });
  };

  handleStatus = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    selectedRows.map(item => {
      if (item.status === 1) {
        dispatch({
          type: 'feedback/status',
          payload: item.id,
        });
      }
    });

    dispatch({
      type: 'feedback/fetch',
      payload: params,
      callback: this.fetchUser,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
        type: 'feedback/fetch',
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
      type: 'feedback/fetch',
      payload: {},
      callback: this.fetchUser,
    });
  };

  renderSearchForm() {
    const { form } = this.props;
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
            <Form.Item label="反馈内容">
              {getFieldDecorator('like_content')(<Input placeholder="支持模糊匹配" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="状态">
              {getFieldDecorator('status')(
                <Radio.Group>
                  <Radio value={0}>全部</Radio>
                  <Radio value={1}>待处理</Radio>
                  <Radio value={2}>已处理</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={this.handleFormReset}
              >
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      feedback: { data },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Button type='dashed' onClick={this.handleStatus}><Icon
                    type='check'/>处理</Button>
                </span>
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
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
