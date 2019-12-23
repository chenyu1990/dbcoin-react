import { Form, Input, Modal } from 'antd';
import React from 'react';
const FormItem = Form.Item;

const CreateForm = props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="新建合约"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="名称">
        {form.getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: '请输入名称',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="简介">
        {form.getFieldDecorator('summary',
        )(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
