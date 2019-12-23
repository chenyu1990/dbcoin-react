import { Button, Card, Form, Tabs, Input, InputNumber, Icon } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import InputFile from './components/InputFile';
import Editor from './components/Editor';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { TextArea } = Input;

const group = [
  {
    name: '全局配置',
    icon: 'global',
    group: 'global',
  },
  {
    name: '阿里短信配置',
    icon: 'message',
    group: 'ali_sms',
  },
  {
    name: '推广奖励',
    icon: 'sliders',
    group: 'stream_reward',
  },
  {
    name: '币配置',
    icon: 'database',
    group: 'coin',
  },
  {
    name: 'UsdtRpc',
    icon: 'menu',
    group: 'usdt_rpc',
  },
  {
    name: '推广说明',
    icon: 'menu',
    group: 'recommend_content',
  },
  {
    name: '关于我们',
    icon: 'menu',
    group: 'about_us',
  },
  {
    name: '用户协议',
    icon: 'menu',
    group: 'agreement',
  },
];

@connect(({ systemConfig }) => ({
  systemConfig,
}))
class Config extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemConfig/fetch',
    });
    this.renderUpdateCacheButton = <Button onClick={this.handleUpdateCache}>更新缓存</Button>;
  }

  handleSubmit = (e, item) => {
    const {
      dispatch,
      form,
      systemConfig: { settings },
    } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      let data = [];

      settings[item.group].map(setting => {
        if (values[item.group][setting.key]) {
          setting.value = values[item.group][setting.key];
        }
        data.push(setting);
        return setting;
      });
      if (!err) {
        dispatch({
          type: 'systemConfig/update',
          payload: data,
        });
      }
    });
  };

  renderTabPane = item => {
    return (
      <React.Fragment>
        <Icon type={item.icon} />
        {item.name}
      </React.Fragment>
    );
  };

  handleUpdateCache = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'systemConfig/patch',
    });
  };

  render() {
    const {
      systemConfig: { settings },
      submitting,
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
        md: {
          span: 10,
        },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 7,
        },
      },
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Tabs tabBarExtraContent={this.renderUpdateCacheButton}>
            {group.map(item => {
              return (
                <TabPane tab={item.name} key={item.group}>
                  <Form
                    onSubmit={e => this.handleSubmit(e, item)}
                    hideRequiredMark
                    style={{
                      marginTop: 8,
                    }}
                  >
                    <React.Fragment>
                      {settings[item.group].map((setting, index) => {
                        switch (setting.dom) {
                          case 'input_number':
                          case 'input': {
                            return (
                              <FormItem {...formItemLayout} label={setting.name}>
                                {getFieldDecorator(`${setting.group}[${setting.key}]`, {
                                  initialValue: setting.value,
                                })(
                                  setting.dom === 'input_number' ? (
                                    <InputNumber
                                      {...setting.param}
                                      style={{ width: '200px' }}
                                      placeholder=""
                                    />
                                  ) : (
                                    <Input />
                                  ),
                                )}
                              </FormItem>
                            );
                          }
                          case 'textarea': {
                            return (
                              <FormItem {...formItemLayout} label={setting.name}>
                                {getFieldDecorator(`${setting.group}[${setting.key}]`, {
                                  initialValue: setting.value,
                                })(<TextArea rows={4} />)}
                              </FormItem>
                            );
                          }
                          case 'file': {
                            return (
                              <FormItem {...formItemLayout} label={setting.name}>
                                {getFieldDecorator(`${setting.group}[${setting.key}]`, {
                                  initialValue: setting.value,
                                })(<InputFile />)}
                              </FormItem>
                            );
                          }
                          case 'editor': {
                            return (
                              <FormItem>
                                {getFieldDecorator(`${setting.group}[${setting.key}]`, {
                                  initialValue: setting.value,
                                })(<Editor />)}
                              </FormItem>
                            );
                          }
                        }
                      })}
                    </React.Fragment>

                    <FormItem
                      {...submitFormLayout}
                      style={{
                        marginTop: 32,
                      }}
                    >
                      <Button type="primary" htmlType="submit" loading={submitting}>
                        保存{item.name}
                      </Button>
                    </FormItem>
                  </Form>
                </TabPane>
              );
            })}
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(
  connect(({ loading }) => ({
    submitting: loading.effects['systemConfig/update'],
  }))(Config),
);
