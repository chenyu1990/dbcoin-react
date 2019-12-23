import { DatePicker, Form, InputNumber, Modal, Select } from 'antd';
import React from 'react';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;

const CreateForm = props => {
  const formLayout = {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 13,
    },
  };
  const { modalVisible, form, handleAdd, handleModalVisible, contractList } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const disabledDate = value => {
    if (!value) {
      return false;
    }
    return (
      value.valueOf() <
      moment()
        .add(-1, 'd')
        .valueOf()
    );
  };

  return (
    <Modal
      destroyOnClose
      title="新建合约计划"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem {...formLayout} label="合约编号">
        {form.getFieldDecorator('contract_id', {
          rules: [
            {
              required: true,
              message: '请选择合约编号',
            },
          ],
        })(
          <Select
            style={{
              width: '100%',
            }}
          >
            {contractList
              ? contractList.map(item => {
                  if (item.machine_status === 1) {
                    return <Option value={item.id}>{item.name}</Option>;
                  }
                })
              : null}
          </Select>,
        )}
      </FormItem>
      <FormItem {...formLayout} label="BTC分红基数">
        {form.getFieldDecorator('btc_base', {
          rules: [
            {
              required: true,
              message: '请输入BTC分红基数',
            },
          ],
        })(
          <InputNumber
            style={{ width: '100%' }}
            min={0.00000001}
            precision={8}
            step={0.0000001}
            placeholder=""
            formatter={val => Number(val).toFixed(8)}
          />,
        )}
      </FormItem>
      <FormItem {...formLayout} label="分红日期">
        {form.getFieldDecorator('date', {
          rules: [
            {
              required: true,
              message: '请选择分红日期',
            },
          ],
        })(
          <DatePicker
            style={{
              width: '100%',
            }}
            disabledDate={disabledDate}
            showTime
            format="YYYY-MM-DD"
            placeholder="分红日期"
          />,
        )}
      </FormItem>
    </Modal>
  );
};

export default Form.create()(CreateForm);
