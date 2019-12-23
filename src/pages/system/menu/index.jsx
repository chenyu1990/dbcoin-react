import {
  Button,
  Card,
  Col,
  Form,
  Radio,
  Icon,
  Input,
  Row,
  Layout, Modal, Tree
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import StandardTable from './components/StandardTable';
import MenuEditor from './components/MenuEditor';
import styles from './style.less';

const { confirm, error } = Modal;
const { TreeNode } = Tree;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ menu, loading }) => ({
  menu,
  loading: loading.models.menu,
}))
class TableList extends Component {
  state = {
    editModalVisible: false,
    selectedRows: [],
    expandedKeys: [],
    formValues: {},
    stepFormValues: {},
    pagination: {},
  };
  columns = [
    {
      title: '菜单名称',
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
      title: '隐藏状态',
      dataIndex: 'hidden',
      render: val => val === 0 ? '显示' : '隐藏',
    },
    {
      title: '菜单图标',
      dataIndex: 'icon',
    },
    {
      title: '访问路由',
      dataIndex: 'router',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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

    this.fetch(params);
  };
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetch(null, true);
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
      type: formType === 'E' ? 'menu/update' : 'menu/add',
      payload: fields,
    });
    this.fetch();
    this.handleEditModalVisible();
  };

  handleEditClick = formType => {
    if (formType === 'E') {
      const { selectedRows } = this.state;
      const { dispatch } = this.props;
      dispatch({
        type: 'menu/get',
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
    const { menu: { treeData } } = this.props;
    const row = selectedRows[0];

    const disableOperationMenus = [
      '/system/menu',
      '/system/role',
      '/user',
    ];

    if (disableOperationMenus.indexOf(row.router) !== -1) {
      error({
        title: '无法删除这个菜单',
        content: '无法删除预设菜单',
      });
      return;
    }
    if (treeData.findIndex(menu => menu.router === row.router && menu.children && menu.children.length > 0) !== -1) {
      error({
        title: '无法删除这个菜单',
        content: '请先删除这个菜单的子菜单',
      });
      return;
    }

    const modal = confirm({
      title: `确认删除这个菜单？`,
      content: (
        <React.Fragment>
          <span style={{
            marginBottom: '10px',
            display: 'block'
          }}>菜单：{row.name}</span>
          <Input placeholder='确认删除请输入菜单名称'
                 onChange={({ target: { value: menuName } }) => {
                   this.setState({ menuName });
                   modal.update({
                     okButtonProps: {
                       disabled: menuName !== row.name
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
          type: 'menu/remove',
          payload: row,
          success: () => {
            this.setState({ menuName: '' });
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
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.fetch(values);
    });
  };

  fetch = (params, reset) => {
    const { dispatch } = this.props;
    const { pagination, name, hidden, parentID } = this.state;
    let payload = {};
    if (typeof reset === 'undefined' || reset !== true) {
      payload = {
        name,
        hidden,
        parentID,
        ...pagination,
        ...params,
      }
    } else {
      payload = params;
    }
    dispatch({
      type: 'menu/fetch',
      payload,
      success: () => this.setState({ selectedRows: [],
        pagination: { page: payload.page, pageSize: payload.pageSize },
        name: payload.name,
        parentID: payload.parentID,
        hidden: payload.hidden,
      }),
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item label="菜单名称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="隐藏状态">
              {getFieldDecorator('hidden')(
                <Radio.Group>
                  <Radio value={null}>全部</Radio>
                  <Radio value={0}>显示</Radio>
                  <Radio value={1}>隐藏</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
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

  renderTreeNodes = data => {
    return data ? data.map(item => {
      if (item.children) {
        return (
          <TreeNode icon={<Icon type={item.icon}/>} title={item.name} key={item.record_id}
                    dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode icon={<Icon type={item.icon}/>} title={item.name} key={item.record_id}
                       dataRef={item}/>;
    }) : null;
  };

  render() {
    const {
      menu: { data, treeData },
      loading,
    } = this.props;
    const { selectedRows, editModalVisible, formType, stepFormValues, expandedKeys } = this.state;
    const parentMethods = {
      handleEdit: this.handleEdit,
      handleEditModalVisible: this.handleEditModalVisible,
      formType,
      treeData,
    };

    return (
      <PageHeaderWrapper>
        <Layout>
          <Layout.Sider
            width={200}
            style={{
              background: '#fff',
              borderRight: '1px solid lightGray'
            }}
          >
            <Tree
              showIcon
              expandedKeys={expandedKeys}
              switcherIcon={<Icon type="down"/>}
              onExpand={expandedKeys => {
                this.setState({ expandedKeys })
              }}
              onSelect={recordID => {
                if (recordID[0]) {
                  this.fetch({ parentID: recordID[0] === 'all' ? null : recordID[0] }, true)
                }
              }}
            >
              {this.renderTreeNodes([{
                record_id: 'all',
                name: '全部'
              }, ...treeData])}
            </Tree>
          </Layout.Sider>
          <Layout.Content>
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
            <MenuEditor {...parentMethods} editModalVisible={editModalVisible}
                      values={stepFormValues}/>
          </Layout.Content>
        </Layout>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
