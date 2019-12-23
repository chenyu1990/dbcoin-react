import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Row,
  Modal
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import StandardTable from './components/StandardTable';
import RoleEditor from './components/RoleEditor';
import styles from './style.less';

const { confirm } = Modal;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
class TableList extends Component {
  state = {
    editModalVisible: false,
    selectedRows: [],
    expandedKeys: [],
    formValues: {},
    stepFormValues: {},
  };
  columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      render: (val, record) => <React.Fragment>
        <Icon type={record.icon}/>{val}
      </React.Fragment>,
    },
    {
      title: '排序值',
      dataIndex: 'sequence',
    },
    {
      title: '角色备注',
      dataIndex: 'memo',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetchTree',
    });
    dispatch({
      type: 'role/fetch',
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
      type: 'role/fetch',
      payload: params,
      success: this.clearSelectRows,
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'role/fetch',
      payload: {},
      success: this.clearSelectRows,
    });
  };

  clearSelectRows = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) {
      return;
    }
    this.setState({ selectedRows: [] });
  };

  handleEditModalVisible = flag => {
    this.setState({
      editModalVisible: !!flag,
    });
  };

  handleEdit = fields => {
    const { formType } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: formType === 'E' ? 'role/update' : 'role/add',
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
        type: 'role/get',
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

  handleDelClick = () => {
    const { selectedRows } = this.state;
    const row = selectedRows[0];
    const modal = confirm({
      title: `确认删除这个菜单？`,
      content: (
        <React.Fragment>
          {row.router === '' ? <span>
            这可能是一个父级菜单
          </span> : null}
          <span style={{
            marginBottom: '10px',
            display: 'block'
          }}>菜单：{row.name}</span>
          <Input placeholder='确认删除请输入菜单名称'
                 onChange={({ target: { value: roleName } }) => {
                   this.setState({ roleName });
                   modal.update({
                     okButtonProps: {
                       disabled: roleName !== row.name
                     },
                   })
                 }}/>
        </React.Fragment>
      ),
      okText: '确认',
      okType: 'danger',
      okButtonProps: {
        disabled: true,
      },
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'role/remove',
          payload: row,
          success: () => {
            this.setState({ roleName: '' });
            this.clearSelectRows();
          },
        });
      },
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
        type: 'role/fetch',
        payload: values,
        success: this.clearSelectRows,
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="角色名称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
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
      role: { data },
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
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleEditClick('A')}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  {selectedRows.length === 1 ? <Button onClick={() => this.handleEditClick('E')}><Icon
                    type='edit'/>编辑</Button> : null}
                  <Button type='danger'
                          onClick={this.handleDelClick}><Icon
                    type='delete'/>删除</Button>
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
              size="small"
            />
          </div>
        </Card>
        <RoleEditor {...parentMethods} editModalVisible={editModalVisible}
                  values={stepFormValues}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
