import { Button, DatePicker, Form, Input, InputNumber, Modal, Select, Steps } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';

const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;

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
      currentStep: 0,
      checkMachineNumber: false,
    };
  }

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const checkMachineNumber = fieldsValue.machine_auto_begin > 0;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
          checkMachineNumber,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        },
      );
    });
  };
  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };
  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  disabledDate = value => {
    if (!value) {
      return false;
    }
    return value.valueOf() < moment().add(1, 'd')
      .valueOf();
  };

  renderContent = (currentStep, formVals) => {
    const { form } = this.props;
    const { checkMachineNumber } = this.state;

    if (currentStep === 1) {
      return [
        <FormItem key="usdt_fee" {...this.formLayout} label="花费USDT">
          {form.getFieldDecorator('usdt_fee', {
            rules: [
              {
                required: true,
                message: '请输入花费USDT',
              },
            ],
            initialValue: formVals.usdt_fee,
          })(<InputNumber min={0} step={100} style={{ width: '100%' }} placeholder=""/>)}
        </FormItem>,
        <FormItem key="got_ttc" {...this.formLayout} label="获得TTC">
          {form.getFieldDecorator('got_ttc', {
            rules: [
              {
                required: true,
                message: '请输入获得TTC',
              },
            ],
            initialValue: formVals.got_ttc,
          })(<InputNumber min={0} step={1000} style={{ width: '100%' }} placeholder=""/>)}
        </FormItem>,
        <FormItem key="got_point" {...this.formLayout} label="获得积分">
          {form.getFieldDecorator('got_point', {
            rules: [
              {
                required: true,
                message: '请输入获得积分',
              },
            ],
            initialValue: formVals.got_point,
          })(<InputNumber min={0} step={100} style={{ width: '100%' }} placeholder=""/>)}
        </FormItem>,
      ];
    }

    if (currentStep === 2) {
      return [
        <FormItem key="sale_time_bgn" {...this.formLayout} label="起卖时间">
          {form.getFieldDecorator('sale_time_bgn', {
            rules: [
              {
                required: true,
                message: '请选择起卖时间！',
              },
            ],
            initialValue: formVals.sale_time_bgn,
          })(
            <DatePicker
              style={{
                width: '100%',
              }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="起卖时间"
            />,
          )}
        </FormItem>,
        <FormItem key="sale_time_end" {...this.formLayout} label="止卖时间">
          {form.getFieldDecorator('sale_time_end', {
            rules: [
              {
                required: true,
                message: '请选择止卖时间！',
              },
            ],
            initialValue: formVals.sale_time_end,
          })(
            <DatePicker
              style={{
                width: '100%',
              }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="止卖时间"
            />,
          )}
        </FormItem>,
        <FormItem key="status" {...this.formLayout} label="合约状态">
          {form.getFieldDecorator('status', {
            rules: [
              {
                required: true,
                message: '合约状态！',
              },
            ],
            initialValue: formVals.status,
          })(
            <Select
              style={{
                width: '100%',
              }}
              value={formVals.status}
            >
              <Option value={1}>正常</Option>
              <Option value={2}>售罄</Option>
              <Option value={3}>下架</Option>
            </Select>,
          )}
        </FormItem>,
        <FormItem key="machine_status" {...this.formLayout} label="矿机状态">
          {form.getFieldDecorator('machine_status', {
            rules: [
              {
                required: true,
                message: '矿机状态！',
              },
            ],
            initialValue: formVals.machine_status,
          })(
            <Select
              style={{
                width: '100%',
              }}
              value={formVals.machine_status}
              defaultValue={2}
            >
              <Option value={1}>运行</Option>
              <Option value={2}>停止</Option>
            </Select>,
          )}
        </FormItem>,
        <FormItem key="number" {...this.formLayout} label="矿机编号">
          {form.getFieldDecorator('number', {
            rules: [
              {
                required: checkMachineNumber,
                message: '请输入矿机编号',
              },
            ],
            initialValue: formVals.number,
          })(<Input placeholder=""/>)}
        </FormItem>,
        <FormItem key="machine_auto_begin" {...this.formLayout} label="开矿日期">
          {form.getFieldDecorator('machine_auto_begin', {
            initialValue: moment(formVals.machine_auto_begin)
              .unix() > moment('1990-01-01')
              .unix() ? moment(formVals.machine_auto_begin) : null,
          })(
            <DatePicker
              disabledDate={this.disabledDate}
              style={{
                width: '100%',
              }}
              format="YYYY-MM-DD"
              placeholder="开矿日期"
            />,
          )}
        </FormItem>,
      ];
    }

    return [
      <FormItem key="name" {...this.formLayout} label="合约名称">
        {form.getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: '请输入合约名称！',
            },
          ],
          initialValue: formVals.name,
        })(<Input placeholder=""/>)}
      </FormItem>,
      <FormItem key="summary" {...this.formLayout} label="合约简介">
        {form.getFieldDecorator('summary', {
          rules: [
            {
              required: true,
              message: '请输入合约简介！',
            },
          ],
          initialValue: formVals.summary,
        })(<Input placeholder=""/>)}
      </FormItem>,
      <FormItem key="total" {...this.formLayout} label="售卖数量">
        {form.getFieldDecorator('total', {
          rules: [
            {
              required: true,
              message: '请输入售卖数量！',
            },
          ],
          initialValue: formVals.total,
        })(<InputNumber min={0} style={{ width: '100%' }} placeholder=""/>)}
      </FormItem>,
      <FormItem key="power" {...this.formLayout} label="算力">
        {form.getFieldDecorator('power', {
          rules: [
            {
              required: true,
              message: '请输入算力！',
            },
          ],
          initialValue: formVals.power,
        })(<InputNumber min={0}
                        style={{ width: '100%' }}
                        step={1000}
                        formatter={value => `${value}T/s`}
                        parser={value => value.replace('T/s', '')}
                        placeholder=""/>)}
      </FormItem>,
    ];
  };
  renderFooter = currentStep => {
    const { handleUpdateModalVisible, values } = this.props;

    if (currentStep === 1) {
      return [
        <Button
          key="back"
          style={{
            float: 'left',
          }}
          onClick={this.backward}
        >
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ];
    }

    if (currentStep === 2) {
      return [
        <Button
          key="back"
          style={{
            float: 'left',
          }}
          onClick={this.backward}
        >
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }

    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { currentStep, formVals } = this.state;
    return (
      <Modal
        width={640}
        bodyStyle={{
          padding: '32px 40px 48px',
          height: '500px',
        }}
        destroyOnClose
        title="规则配置"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <Steps
          style={{
            marginBottom: 28,
          }}
          size="small"
          current={currentStep}
        >
          <Step title="基本信息"/>
          <Step title="费用设置"/>
          <Step title="售卖状态"/>
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

export default Form.create()(UpdateForm);
