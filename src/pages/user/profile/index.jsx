import {
  Button,
  Card,
  Col,
  Avatar,
  DatePicker,
  Form,
  Icon,
  Input,
  Popover,
  InputNumber,
  Row,
  Select,
  Switch,
  Divider, Radio,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import PointForm from './components/PointForm';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';
import * as API from '@/api';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ profile, user, stream, loading }) => ({
  user,
  stream,
  profile,
  loading: loading.models.profile,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    users: {},
    profiles: {},
  };
  columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      render: val => {
        return (
          <Avatar shape="square" size={64} icon="user" src={`${API.DATA.ATTACHMENT}/${val}`} />
        );
      },
    },
    {
      title: '用户名',
      render: (val, record) => {
        const { users, profiles } = this.state;
        if (!users[record.record_id]) {
          return null;
        }
        const userName = users[record.record_id].user_name;
        let upstream = { name: '', phone: '' };
        if (record.up_record_id && users[record.up_record_id] && profiles[record.up_record_id]) {
          upstream = {
            name: profiles[record.up_record_id].real_name
              ? profiles[record.up_record_id].real_name
              : profiles[record.up_record_id].nick_name
              ? profiles[record.up_record_id].nick_name
              : userName,
            phone: users[record.up_record_id].phone,
            level: profiles[record.up_record_id].level,
          };
        }
        const { stream } = this.props;
        const totalDownstream = stream[record.record_id] ? stream[record.record_id].total : 0;
        const content = (
          <div>
            <p>用户名：{userName}</p>
            <p>真实姓名：{record.real_name}</p>
            <p>昵称：{record.nick_name}</p>
            <p>下级总人数：{totalDownstream}</p>
            <Divider type="horizontal" />
            <p>推广人等级：{upstream.level}</p>
            <p>推广人姓名：{upstream.name}</p>
            <p>推广人手机：{upstream.phone}</p>
          </div>
        );
        return (
          <Popover content={content} placement="right" title="用户信息" trigger="hover">
            <Button
              type="link"
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {record.real_name ? record.real_name : record.nick_name ? record.nick_name : userName}
              <Icon
                type="appstore"
                theme="twoTone"
                style={{
                  fontSize: '20px',
                  display: 'flex',
                }}
              />
            </Button>
          </Popover>
        );
      },
    },
    {
      title: '手机号',
      render: (_, record) => {
        const { users } = this.state;
        return users[record.record_id] ? users[record.record_id].phone : '';
      },
    },
    {
      title: '钱包',
      render: (val, record) => {
        const title = `${record.real_name}的钱包信息`;
        const content = (
          <div>
            <Button type="primary" onClick={() => this.handleModalVisible(true, record)}>
              积分调整
            </Button>
          </div>
        );
        return (
          <Popover content={content} placement="right" title={title} trigger="hover">
            <Button
              type="link"
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icon
                type="wallet"
                theme="twoTone"
                twoToneColor="#ed8e1d"
                style={{
                  fontSize: '20px',
                  display: 'flex',
                }}
              />
            </Button>
          </Popover>
        );
      },
    },
    {
      title: '持有合约份数',
      dataIndex: 'contract_count',
    },
    {
      title: '邀请码',
      dataIndex: 'invite_code',
    },
    {
      title: '允许提现',
      dataIndex: 'allow_withdraw',

      render: (val, record) => {
        return (
          <Switch
            checkedChildren="允许"
            unCheckedChildren="禁用"
            onChange={() => {
              record.allow_withdraw = record.allow_withdraw === 1 ? 2 : 1;
              this.handleUpdate(record);
            }}
            checked={record.allow_withdraw === 1}
          />
        );
      },
    },
    {
      title: '创建时间',
      render: (_, record) => {
        const { users } = this.state;
        if (!users[record.record_id]) {
          return null;
        }
        return (
          <span>{moment(users[record.record_id].created_at).format('YYYY-MM-DD HH:mm:ss')}</span>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/fetch',
      callback: this.handleUsers,
    });
  }

  handleUsers = ({ response, data: { list } }) => {
    const { dispatch } = this.props;
    const { users } = this.state;
    if (response.status === 200) {
      let queryUsers = [];
      list.map(({ record_id, up_record_id }) => {
        dispatch({
          type: 'stream/count',
          payload: {
            record_id,
          },
        });
        if (!users[record_id]) {
          queryUsers.push(record_id);
        }
        if (up_record_id && !users[up_record_id]) {
          queryUsers.push(up_record_id);
        }
      });

      dispatch({
        type: 'user/fetch',
        payload: {
          record_ids: queryUsers.join(','),
          pageSize: 20,
        },

        callback: ({ response, data: { list } }) => {
          if (response.status === 200) {
            list.map(item => {
              users[item.record_id] = item;
            });
            this.setState({ users });
          }
        },
      });

      dispatch({
        type: 'profile/pureFetch',
        payload: {
          record_ids: queryUsers.join(','),
          pageSize: 20,
        },

        callback: ({ response, data: { list } }) => {
          if (response.status === 200) {
            const { profiles } = this.state;
            list.map(item => {
              profiles[item.record_id] = item;
            });
            this.setState({ profiles });
          }
        },
      });
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
      type: 'profile/fetch',
      payload: params,
      callback: this.handleUsers,
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'profile/fetch',
      payload: {},
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
        type: 'profile/fetch',
        payload: values,
        callback: this.handleUsers,
      });
    });
  };
  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      stepFormValues: record || {},
    });
  };
  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };
  handleDisableUsers = records => {
    for (let record of records) {
      record.status = 2;
      const { dispatch } = this.props;
      dispatch({
        type: 'user/disable',
        payload: record,
      });
    }
  };
  handleEnableUsers = records => {
    for (let record of records) {
      record.status = 1;
      const { dispatch } = this.props;
      dispatch({
        type: 'user/enable',
        payload: record,
      });
    }
  };

  handlePoint = fields => {
    const { dispatch } = this.props;
    fields.btc = fields.btc > 0 ? Number(Number(fields.btc).toFixed(8)) : 0;
    fields.usdt = fields.usdt > 0 ? Number(Number(fields.usdt).toFixed(8)) : 0;
    dispatch({
      type: 'profile/point',
      payload: fields,
    });
    this.handleModalVisible();
  };
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/update',
      payload: fields,
    });
    this.handleUpdateModalVisible();
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
              {getFieldDecorator('phone')(<Input placeholder="以逗号分割多个号码" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="邀请码">
              {getFieldDecorator('invite_code')(<Input />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="提现状态">
              {getFieldDecorator('allow_withdraw', {
              })(
                <Radio.Group>
                  <Radio value={0}>全部</Radio>
                  <Radio value={1}>允许</Radio>
                  <Radio value={2}>禁止</Radio>
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
      profile: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    /*
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );*/
    const parentMethods = {
      handlePoint: this.handlePoint,
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
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Button
                    type='danger'
                    onClick={() => this.handleDisableUsers(selectedRows)}
                  >
                    批量禁用
                  </Button>
                  <Button onClick={() => this.handleEnableUsers(selectedRows)}>批量启用</Button>
                  {/*
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down"/>
                    </Button>
                  </Dropdown>
                  */}
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
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <Fragment>
            <PointForm {...parentMethods} values={stepFormValues} modalVisible={modalVisible} />
            <UpdateForm
              {...updateMethods}
              updateModalVisible={updateModalVisible}
              values={stepFormValues}
            />
          </Fragment>
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
