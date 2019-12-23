import { Input, Button, Card, Divider, Form, Modal, Switch, Row, Col, Select, Radio } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';

const { confirm } = Modal;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const articleCate = [
  '',
  '新闻咨询',
  '商学院推荐',
  '视频讲解',
  '音频讲解',
  '电子书讲解',
  '新手指导',
];

/* eslint react/no-multi-comp:0 */
@connect(({ article, loading }) => ({
  article,
  loading: loading.models.article,
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
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '分类',
      dataIndex: 'cat_id',

      render(val) {
        return <Fragment>{articleCate[val] ? articleCate[val] : '系统文章'}</Fragment>;
      },
    },
    {
      title: '排序',
      dataIndex: 'display_order',
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '阅读量',
      dataIndex: 'click_count',
    },
    {
      title: '状态',
      dataIndex: 'status',

      render: (val, record) => {
        return (
          <Switch
            checkedChildren="正常"
            unCheckedChildren="禁用"
            onChange={() => {
              this.handleSwitchArticleStatus(record);
            }}
            checked={record.status === 1}
          />
        );
      },
    },
    {
      title: '操作',
      render: (text, record) => {
        return <Fragment>
          <a onClick={() => this.handleEdit(record)}>编辑</a>
          <Divider type="vertical"/>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
          <Divider type="vertical"/>
          <a
            style={{ color: 'red' }}
            onClick={() => {
              const modal = confirm({
                title: `确认删除这篇文章？`,
                content: (
                  <React.Fragment>
                    <span style={{
                      marginBottom: '10px',
                      display: 'block'
                    }}>标题：{record.title}</span>
                    <Input placeholder='确认删除请输入文章标题'
                           onChange={({ target: { value: deleteTitle } }) => {
                             this.setState({ deleteTitle });
                             modal.update({
                               okButtonProps: {
                                 disabled: deleteTitle !== record.title
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
                    type: 'article/remove',
                    payload: record,
                    callback: ({ response }) => {
                      if (response.status === 200) this.setState({ deleteTitle: '' })
                    },
                  });
                },
              });
            }}
          >
            删除
          </a>
        </Fragment>
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/fetch',
    });
  }

  handleSwitchArticleStatus = record => {
    const { dispatch } = this.props;
    let type;
    if (record.status === 1) {
      type = 'article/disable';
      record.status = 2;
    } else {
      type = 'article/enable';
      record.status = 1;
    }
    dispatch({
      type: type,
      payload: record,
    });
  };
  handleEdit = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/edit',
      payload: record,
    });
  };
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
      type: 'article/fetch',
      payload: params,
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
  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/add',
      payload: fields,
    });
    this.handleModalVisible();
  };
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'article/update',
      payload: fields,
    });
    this.handleUpdateModalVisible();
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'article/fetch',
        payload: values,
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
      type: 'article/fetch',
      payload: {},
    });
  };

  renderSearchForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="分类">
              {getFieldDecorator('cat_ids')(
                <Select mode="tags">
                  {articleCate.map((cat, index) => {
                    if (cat) {
                      return <Select.Option key={index.toString()} value={index.toString()} >{cat}</Select.Option>
                    }
                    return null;
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="标题">
              {getFieldDecorator('like_title')(<Input placeholder='支持模糊匹配' />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="作者">
              {getFieldDecorator('like_author')(<Input placeholder='支持模糊匹配' />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="状态">
              {getFieldDecorator('status')(
                <Radio.Group>
                  <Radio value={0}>全部</Radio>
                  <Radio value={1}>正常</Radio>
                  <Radio value={2}>禁用</Radio>
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
      article: { data },
      loading,
    } = this.props;
    const { modalVisible, updateModalVisible, stepFormValues } = this.state;
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
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <StandardTable
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
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
