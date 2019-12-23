import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Radio } from 'antd';
import RoleSelect from './RoleSelect';

@connect(user => ({
  user,
}))
class UserEditor extends PureComponent {
  static defaultProps = {
    handleEdit: () => {},
    handleEditModalVisible: () => {},
    values: {},
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

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
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
        width={600}
        visible={editModalVisible}
        destroyOnClose
        onCancel={() => handleEditModalVisible(false, values)}
        onOk={this.handleSubmit}
        afterClose={() => handleEditModalVisible()}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form>
          <Form.Item {...this.formItemLayout} label="用户名">
            {getFieldDecorator('user_name', {
              initialValue: formType === 'A' ? null : values.user_name,
              rules: [
                {
                  required: true,
                  message: '请输入用户名',
                },
              ],
            })(<Input placeholder="请输入用户名" />)}
          </Form.Item>
          <Form.Item {...this.formItemLayout} label="登录密码">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: formType === 'A',
                  message: '请输入登录密码',
                },
              ],
            })(
              <Input
                type="password"
                placeholder={formType === 'A' ? '请输入登录密码' : '留空则不修改登录密码'}
              />
            )}
          </Form.Item>
          <Form.Item {...this.formItemLayout} label="所属角色">
            {getFieldDecorator('roles', {
              initialValue: formType === 'A' ? null : values.roles,
            })(<RoleSelect />)}
          </Form.Item>
          <Form.Item {...this.formItemLayout} label="用户状态">
            {getFieldDecorator('status', {
              initialValue: formType === 'A' ? 1 : values.status,
            })(
              <Radio.Group>
                <Radio value={1}>正常</Radio>
                <Radio value={2}>停用</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item {...this.formItemLayout} label="邮箱">
            {getFieldDecorator('email', {
              initialValue: formType === 'A' ? null : values.email,
            })(<Input placeholder="请输入邮箱" />)}
          </Form.Item>
          <Form.Item {...this.formItemLayout} label="手机号">
            {getFieldDecorator('phone', {
              initialValue: formType === 'A' ? null : values.phone,
            })(<Input placeholder="请输入手机号" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(UserEditor);
