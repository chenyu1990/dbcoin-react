import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, DatePicker, Select, InputNumber } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';

@connect(user => ({
  user,
}))
class Editor extends PureComponent {
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
        title={formType === 'A' ?
          formatMessage({ id: 'component.operation.create' }) :
          formatMessage({ id: 'component.operation.update' })}
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
          <Form.Item {...this.formItemLayout} label={formatMessage({
            id: 'contract.field.coin_type',
          })}>
            {getFieldDecorator('coin_type', {
              rules: [
                {
                  required: formType === 'A',
                  message: formatMessage({ id: 'component.placeholder.content' }, {
                    content: formatMessage({
                      id: 'contract.field.coin_type',
                    }),
                  }),
                },
              ],
            })(<Select style={{ width: '100%' }}>
                <Select.Option value={1}>USDT</Select.Option>
              </Select>)}
          </Form.Item>
          <Form.Item {...this.formItemLayout} label={formatMessage({
            id: 'contract.field.name',
          })}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: formType === 'A',
                  message: formatMessage({ id: 'component.placeholder.content' }, {
                    content: formatMessage({
                      id: 'contract.field.name',
                    }),
                  }),
                },
              ],
            })(<Input placeholder={formatMessage({ id: 'component.placeholder.content' }, {
              content: formatMessage({
                id: 'contract.field.name',
              }),
            })} />)}
          </Form.Item>
          <Form.Item {...this.formItemLayout} label={formatMessage({
            id: 'contract.field.dividend_ratio',
          })}>
            {getFieldDecorator('dividend_ratio', {
              initialValue: formType === 'A' ? null : values.dividend_ratio,
              rules: [
                {
                  message: formatMessage({ id: 'component.placeholder.content' }, {
                    content: formatMessage({
                      id: 'contract.field.dividend_ratio',
                    }),
                  }),
                },
              ],
            })(<InputNumber min={0} step={100} max={99999999} style={{ width: '100%' }} />)}
          </Form.Item>
          <Form.Item {...this.formItemLayout} label={formatMessage({
            id: 'contract.field.price',
          })}>
            {getFieldDecorator('price', {
              initialValue: formType === 'A' ? null : values.price,
              rules: [
                {
                  message: formatMessage({ id: 'component.placeholder.content' }, {
                    content: formatMessage({
                      id: 'contract.field.price',
                    }),
                  }),
                },
              ],
            })(<InputNumber min={100} step={100} max={99999999} style={{ width: '100%' }} />)}
          </Form.Item>
          <Form.Item {...this.formItemLayout} label={formatMessage({
            id: 'contract.field.sale_time_bgn',
          })}>
            {getFieldDecorator('sale_time_bgn', {
              initialValue: formType === 'A' ? null : values.sale_time_bgn,
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'component.placeholder.content' }, {
                    content: formatMessage({
                      id: 'contract.field.sale_time_bgn',
                    }),
                  }),
                },
              ],
            })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(Editor);
