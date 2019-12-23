import { Button, Form, Table, Popconfirm } from 'antd';
import React, { PureComponent } from 'react';
import uuid from 'uuid/v4';

import styles from '../../style.less';
import { EditableCell, EditableFormRow } from './EditableCell';

function fillKey(data) {
  if (!data) {
    return [];
  }
  return data.map(item => {
    const nItem = { ...item };
    if (!nItem.key) {
      nItem.key = uuid();
    }
    return nItem;
  });
}

class Index extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: fillKey(props.value),
    };

    this.columns = [
      {
        title: '动作编号',
        dataIndex: 'code',
        editable: true,
        width: '40%',
      },
      {
        title: '动作名称',
        dataIndex: 'name',
        editable: true,
        width: '45%',
      },
      {
        title: '操作',
        dataIndex: 'key',
        width: '10%',
        render: (_, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="确定要删除该数据吗？" onConfirm={() => this.handleDelete(record.key)}>
              <a>删除</a>
            </Popconfirm>
          ) : null,
      },
    ];
  }

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    const data = dataSource.filter(item => item.key !== key);
    this.setState({ dataSource: data }, () => this.triggerChange(data));
  };

  handleClean = () => {
    this.setState({ dataSource: [] }, () => this.triggerChange([]));
  };

  handleAdd = () => {
    const { dataSource } = this.state;
    const newData = {
      key: uuid(),
      code: '',
      name: '',
    };
    const data = [...dataSource, newData];
    this.setState({ dataSource: data }, () => this.triggerChange(data));
  };

  triggerChange = data => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(data);
    }
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData }, () => this.triggerChange(newData));
  };

  handleAddTpl = (advanced) => {
    const simpleTpl = [
      {
        code: 'query',
        name: '查询',
      },
      {
        code: 'add',
        name: '新增',
      },
      {
        code: 'edit',
        name: '编辑',
      },
      {
        code: 'del',
        name: '删除',
      },
    ];
    const advancedTpl = [
      {
        code: 'enable',
        name: '启用',
      },
      {
        code: 'disable',
        name: '禁用',
      },
    ];

    const tplData = advanced ? [ ...simpleTpl, ...advancedTpl ] : simpleTpl;
    const newData = tplData.map(v => ({ key: v.code, ...v }));

    const { dataSource } = this.state;
    const data = [...dataSource];
    for (let i = 0; i < newData.length; i += 1) {
      let exists = false;
      for (let j = 0; j < dataSource.length; j += 1) {
        if (dataSource[j].key === newData[i].key) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        data.push(newData[i]);
      }
    }

    this.setState({ dataSource: data }, () => this.triggerChange(data));
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <React.Fragment>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button onClick={this.handleAdd} size="small" type="primary">
              新增
            </Button>
            <Button onClick={this.handleClean} size="small" type="danger">
              清空
            </Button>
            <Button onClick={() => this.handleAddTpl(false)} size="small" type="primary">
              使用基础模板
            </Button>
            <Button onClick={() => this.handleAddTpl(true)} size="small" type="primary">
              使用高级模板
            </Button>
          </div>
          <Table
            rowKey={record => record.key}
            components={components}
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            size="small"
          />
        </div>
      </React.Fragment>
    );
  }
}

export default Form.create()(Index);
