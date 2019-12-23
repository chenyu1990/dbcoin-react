import { Form, Input, Modal } from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item;

class UpdateForm extends Component {
  static defaultProps = {
    handleUpdate: () => {
    },
    handleUpdateModalVisible: () => {
    },
    values: {},
  };
  formLayout = {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 5,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      formVals: props.values,
    };
  }

  handleSubmit = () => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          handleUpdate(formVals);
        },
      );
    });
  };

  renderContent = (formVals) => {
    const { form } = this.props;
    return [
      <FormItem {...this.formLayout} label="等级">
        <Input value={formVals.level} readOnly={true}/>
      </FormItem>,
      <FormItem key="downstream_level_count" {...this.formLayout} label="升级要求（直推等级）">
        {form.getFieldDecorator('downstream_level_count', {
          rules: [
            {
              required: true,
              message: '请输入升级要求（直推等级）',
            },
          ],
          initialValue: formVals.downstream_level_count,
        })(<Input placeholder=""/>)}
      </FormItem>,
      <FormItem key="downstream_contract_total" {...this.formLayout} label="升级要求（推荐购买合约）">
        {form.getFieldDecorator('downstream_contract_total', {
          rules: [
            {
              required: true,
              message: '请输入升级要求（推荐购买合约）',
            },
          ],
          initialValue: formVals.downstream_contract_total,
        })(<Input placeholder=""/>)}
      </FormItem>,
      <FormItem key="btc_percentage" {...this.formLayout} label="矿机BTC奖励比例">
        {form.getFieldDecorator('btc_percentage', {
          rules: [
            {
              required: true,
              message: '请输入矿机BTC奖励比例',
            },
          ],
          initialValue: formVals.btc_percentage,
        })(<Input placeholder=""/>)}
      </FormItem>,
      <FormItem key="usdt_percentage" {...this.formLayout} label="矿机USDT奖励比例">
        {form.getFieldDecorator('usdt_percentage', {
          rules: [
            {
              required: true,
              message: '请输入矿机USDT奖励比例',
            },
          ],
          initialValue: formVals.usdt_percentage,
        })(<Input placeholder=""/>)}
      </FormItem>,
      <FormItem key="ttc_percentage" {...this.formLayout} label="矿机TTC奖励比例">
        {form.getFieldDecorator('ttc_percentage', {
          rules: [
            {
              required: true,
              message: '请输入矿机TTC奖励比例',
            },
          ],
          initialValue: formVals.ttc_percentage,
        })(<Input placeholder=""/>)}
      </FormItem>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { formVals } = this.state;
    return (
      <Modal
        width={640}
        bodyStyle={{
          padding: '32px 40px 48px',
        }}
        destroyOnClose
        title="配置等级"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false, values)}
        onOk={this.handleSubmit}
        afterClose={() => handleUpdateModalVisible()}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

export default Form.create()(UpdateForm);
