import { Input, Form } from 'antd';
import { PureComponent } from 'react';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

export const EditableFormRow = Form.create()(EditableRow);

export class EditableCell extends PureComponent {
  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { dataIndex, record, title } = this.props;
    return <Form.Item style={{ margin: 0 }}>
      {form.getFieldDecorator(dataIndex, {
        rules: [
          {
            required: true,
            message: `请输入${title}`,
          },
        ],
        initialValue: record[dataIndex],
      })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
    </Form.Item>
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}
