import { Form, Input, InputNumber, Modal } from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item;

class UpdateForm extends Component {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };
  formLayout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 13,
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

  renderContent = formVals => {
    const { form, select } = this.props;
    let contractName;
    for (let contract of select) {
      if (contract.id === formVals.contract_id) {
        contractName = <Input readOnly={true} value={contract.name} />;
        break;
      }
    }

    return [
      <FormItem {...this.formLayout} label="合约编号">
        {contractName}
      </FormItem>,
      <FormItem {...this.formLayout} label="BTC分红基数">
        {form.getFieldDecorator('btc_base', {
          rules: [
            {
              required: true,
              message: '请输入BTC分红基数',
            },
          ],
          initialValue: formVals.btc_base,
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
        title="修改合约计划"
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
