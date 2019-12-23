import {
  Card, Col,
  Form, Icon,
  Input,
  InputNumber,
  Modal, Radio,
  Row,
  Tooltip, TreeSelect
} from 'antd';
import React, { Component } from 'react';

import MenuAction from './MenuAction';
import MenuResource from './MenuResource';

class MenuEditor extends Component {
  static defaultProps = {
    handleEdit: () => {},
    handleEditModalVisible: () => {},
    values: {},
  };
  formLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };

  handleSubmit = () => {
    const { form, handleEdit, values: oldValue } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formValues = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formValues,
        },
        () => {
          handleEdit(formValues);
        },
      );
    });
  };

  toTreeSelect = data => {
    if (!data) {
      return [];
    }
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = { ...data[i], title: data[i].name, value: data[i].record_id };
      if (item.children && item.children.length > 0) {
        item.children = this.toTreeSelect(item.children);
      }
      newData.push(item);
    }
    return newData;
  };

  render() {
    const {
      editModalVisible, handleEditModalVisible,
      formType, treeData, values,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Modal
        title={formType === 'A' ? '新增' : '编辑'}
        width={900}
        visible={editModalVisible}
        destroyOnClose
        onCancel={() => handleEditModalVisible(false, values)}
        onOk={this.handleSubmit}
        afterClose={() => handleEditModalVisible()}
        style={{ top: 20 }}
        bodyStyle={{
          maxHeight: 'calc( 100vh - 158px )',
          overflowY: 'auto'
        }}
      >
        <Card bordered={false}>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item {...this.formLayout} label="菜单名称">
                  {getFieldDecorator('name', {
                    initialValue: formType === 'A' ? null : values.name,
                    rules: [
                      {
                        required: true,
                        message: '请输入菜单名称',
                      },
                    ],
                  })(<Input placeholder="请输入"/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...this.formLayout} label="上级菜单">
                  {getFieldDecorator('parent_id', {
                    initialValue: formType === 'A' ? null : values.parent_id,
                  })(
                    <TreeSelect
                      showSearch
                      treeNodeFilterProp="title"
                      style={{ width: '100%' }}
                      dropdownStyle={{
                        maxHeight: 400,
                        overflow: 'auto'
                      }}
                      treeData={this.toTreeSelect(treeData)}
                      placeholder='无上级目录'
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...this.formLayout} label="菜单图标">
                  <Row>
                    <Col span={20}>
                      {getFieldDecorator('icon', {
                        initialValue: formType === 'A' ? null : values.icon,
                        rules: [
                          {
                            required: true,
                            message: '请输入菜单图标',
                          },
                        ],
                      })(<Input placeholder="请输入"/>)}
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <Tooltip title="图标仅支持官方Icon图标">
                        <Icon type="question-circle"/>
                      </Tooltip>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...this.formLayout} label="访问路由">
                  {getFieldDecorator('router', {
                    initialValue: formType === 'A' ? null : values.router,
                  })(<Input placeholder="请输入"/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...this.formLayout} label="菜单图标">
                  <Row>
                    <Col span={20}>
                      {getFieldDecorator('sequence', {
                        initialValue: formType === 'A' ? 1000000 : values.sequence,
                        rules: [
                          {
                            required: true,
                            message: '请输入排列顺序',
                          },
                        ],
                      })(<InputNumber min={1} step={100} max={99999999} style={{ width: '100%' }} />)}
                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                      <Tooltip title="降序排列，越大越靠前">
                        <Icon type="question-circle"/>
                      </Tooltip>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...this.formLayout} label="隐藏状态">
                  {getFieldDecorator('hidden', {
                    initialValue: formType === 'A' ? 0 : values.hidden,
                  })(
                    <Radio.Group>
                      <Radio value={0}>显示</Radio>
                      <Radio value={1}>隐藏</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Card title="菜单动作管理" bordered={false}>
                  {getFieldDecorator('actions', {
                    initialValue: formType === 'A' ? null : values.actions,
                  })(<MenuAction />)}
                </Card>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Card title="菜单资源管理" bordered={false}>
                  {getFieldDecorator('resources', {
                    initialValue: formType === 'A' ? null : values.resources,
                  })(<MenuResource />)}
                </Card>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default Form.create()(MenuEditor);
