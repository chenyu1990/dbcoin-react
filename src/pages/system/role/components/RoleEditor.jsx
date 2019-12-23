import {
  Card, Col,
  Form, Icon,
  Input,
  InputNumber,
  Modal,
  Row,
  Tooltip
} from 'antd';
import React, { Component } from 'react';

import RoleMenu from './RoleMenu';

class RoleEditor extends Component {
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

  render() {
    const {
      editModalVisible, handleEditModalVisible,
      formType, values,
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
              <Col>
                <Form.Item {...this.formLayout} label="角色名称">
                  {getFieldDecorator('name', {
                    initialValue: formType === 'A' ? null : values.name,
                    rules: [
                      {
                        required: true,
                        message: '请输入角色名称',
                      },
                    ],
                  })(<Input placeholder="请输入角色名称" />)}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item {...this.formLayout} label="排序值">
                  <Row>
                    <Col span={20}>
                      {getFieldDecorator('sequence', {
                        initialValue: formType === 'A' ? 1000000 : values.sequence,
                        rules: [
                          {
                            required: true,
                            message: '请输入排序值',
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
              <Col>
                <Form.Item {...this.formLayout} label="备注">
                  {getFieldDecorator('memo', {
                    initialValue: formType === 'A' ? null : values.memo,
                  })(<Input.TextArea rows={2} placeholder="请输入备注" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Card title="选择菜单权限" bordered={false}>
                  {getFieldDecorator('menus', {
                    required: true,
                    initialValue: formType === 'A' ? null : values.menus,
                  })(<RoleMenu />)}
                </Card>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default Form.create()(RoleEditor);
