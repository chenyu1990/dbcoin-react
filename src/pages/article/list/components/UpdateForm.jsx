import { Form, Input, InputNumber, Modal, Select } from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item;
const { Option } = Select;

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
    const { form } = this.props;

    return [
      <FormItem {...this.formLayout} label="文章分类">
        {form.getFieldDecorator('cat_id', {
          rules: [
            {
              required: true,
              message: '请选择文章分类！',
            },
          ],
          initialValue: formVals.cat_id,
        })(
          <Select
            style={{
              width: '100%', // 99-系统文章 1-新闻咨询 2-商学院推荐 3-视频讲解 4-音频讲解 5-电子书讲解 6-新手指导
            }}
            value={formVals.cat_id}
          >
            <Option value={1}>新闻咨询</Option>
            <Option value={2}>商学院推荐</Option>
            <Option value={3}>视频讲解</Option>
            <Option value={4}>音频讲解</Option>
            <Option value={5}>电子书讲解</Option>
            <Option value={6}>新手指导</Option>
            <Option value={99}>系统文章</Option>
          </Select>,
        )}
      </FormItem>,
      <FormItem {...this.formLayout} label="文章标题">
        {form.getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: '文章标题',
            },
          ],
          initialValue: formVals.title,
        })(<Input placeholder="" />)}
      </FormItem>,
      <FormItem {...this.formLayout} label="文章简介">
        {form.getFieldDecorator('summary', {
          initialValue: formVals.summary,
        })(<Input placeholder="" />)}
      </FormItem>,
      <FormItem {...this.formLayout} label="显示顺序">
        {form.getFieldDecorator('display_order', {
          initialValue: formVals.display_order,
        })(<InputNumber style={{ width: '100%' }} min={0} max={255} step={5} placeholder="" />)}
      </FormItem>,
      <FormItem {...this.formLayout} label="作者">
        {form.getFieldDecorator('author', {
          initialValue: formVals.author,
        })(<Input placeholder="" />)}
      </FormItem>,
      <FormItem {...this.formLayout} label="点击量">
        {form.getFieldDecorator('click_count', {
          rules: [
            {
              required: true,
              message: '请输入点击量',
            },
          ],
          initialValue: formVals.click_count,
        })(<InputNumber style={{ width: '100%' }} min={0} placeholder="" />)}
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
        title="文章属性"
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
