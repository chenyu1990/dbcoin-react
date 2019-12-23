import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Radio,
  Row,
  Switch,
  Select,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable from './components/StandardTable';
import UserEditor from './components/UserEditor';
import RoleSelect from './components/RoleSelect';
import styles from './style.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['default', 'processing', 'error'];
const status = ['未知状态', '正常', '禁用'];

/* eslint react/no-multi-comp:0 */
@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
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
      title: '用户名',
      dataIndex: 'user_name',
      render(val, record) {
        return <Badge status={statusMap[record.status]} text={val}/>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roles',
      render: val => {
        if (!val || val.length === 0) {
          return <span>-</span>;
        }
        const names = [];
        for (let i = 0; i < val.length; i += 1) {
          names.push(val[i].name);
        }
        return <span>{names.join(' | ')}</span>;
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      render: val => <span>{moment(val)
        .format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',

      render: (val, record) => {
        return <Switch checkedChildren="正常" unCheckedChildren="禁用"
                       onChange={() => this.handleSwitchUserStatus(record)} checked={val === 1}/>;
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
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
      type: 'user/fetch',
      payload: params,
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'user/fetch',
      payload: {},
    });
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
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let role_ids = '';
      if (fieldsValue.role_ids) {
        role_ids = fieldsValue.role_ids.map(v => v.role_id).join(',');
      }
      const values = {
        ...fieldsValue,
        role_ids,
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'user/fetch',
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
  handleSwitchUserStatus = record => {
    const { dispatch } = this.props;
    let type;
    if (record.status === 1) {
      type = 'user/disable';
      record.status = 2;
    } else {
      type = 'user/enable';
      record.status = 1;
    }
    dispatch({
      type: type,
      payload: record,
    });
  };

  handleEdit = fields => {
    const { formType } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: formType === 'E' ? 'user/update' : 'user/add',
      payload: fields,
      success: this.clearSelectRows,
    });
    this.handleEditModalVisible();
  };

  handleEditClick = formType => {
    if (formType === 'E') {
      const { selectedRows } = this.state;
      const { dispatch } = this.props;
      dispatch({
        type: 'user/get',
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

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="用户名">
              {getFieldDecorator('user_name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="真实姓名">
              {getFieldDecorator('real_name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="所属角色">{getFieldDecorator('role_ids')(<RoleSelect />)}</Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="用户状态">
              {getFieldDecorator('status')(
                <Radio.Group>
                  <Radio value="0">全部</Radio>
                  <Radio value="1">正常</Radio>
                  <Radio value="2">停用</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      user: { data },
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
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleEditClick('A')}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  {selectedRows.length === 1 ?
                    <Button onClick={() => this.handleEditClick('E')}><Icon
                      type='edit'/>编辑</Button> : null}
                  <Button type='danger'
                          onClick={() => this.handleDisableUsers(selectedRows)}>批量禁用</Button>
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
        <UserEditor {...parentMethods} editModalVisible={editModalVisible}
                    values={stepFormValues}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
