import { Form, Input, Modal, Radio, InputNumber } from 'antd';
import React from 'react';

const InputGroup = Input.Group;
const FormItem = Form.Item;
const { TextArea } = Input;

const PointForm = props => {
  const { modalVisible, form, handlePoint, handleModalVisible, values } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      fieldsValue.record_id = values.record_id;
      handlePoint(fieldsValue);
    });
  };

  const type = {
    float: {
      pattern: /^[0-9.]+$/,
      message: '请输入小数',
    },
    integer: {
      pattern: /^[0-9]+$/,
      message: '请输入整数',
    },
  };

  const points = [
    {
      field: 'usdt',
      label: 'USDT',
      precision: 8,
    },
    {
      field: 'btc',
      label: 'BTC',
      precision: 8,
    },
  ];

  const memo = {
    increase: '在当前余额基础上增加X',
    decrease: '在当前余额基础上减少X',
    modify: '直接修改余额为指定值(不推荐使用此方式)',
  };

  return (
    <Modal
      destroyOnClose
      title="调整用户积分"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {form.getFieldDecorator('action', {
        initialValue: 'increase',
      })(
        <Radio.Group
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
          buttonStyle="solid"
        >
          <Radio.Button value="increase">增加积分</Radio.Button>
          <Radio.Button value="decrease">减少积分</Radio.Button>
          <Radio.Button value="modify">修改积分</Radio.Button>
        </Radio.Group>,
      )}
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {memo[form.getFieldValue('action')]}
      </div>
      {points.map(fields => (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={fields.label}>
          <InputGroup compact>
            <InputNumber
              style={{ width: '50%' }}
              defaultValue={values[fields.field]}
              readOnly={true}
              precision={fields.precision}
            />
            {form.getFieldDecorator(fields.field)(
              <InputNumber
                style={{ width: '50%' }}
                placeholder={`请输入${fields.label}`}
                precision={fields.precision}
              />,
            )}
          </InputGroup>
        </FormItem>
      ))}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remark', {
          rules: [
            {
              required: true,
              message: '请输入备注',
            },
          ],
        })(<TextArea rows={2} placeholder="请输入备注" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(PointForm);
