import { Form, Input, InputNumber, Modal, Select } from 'antd';
import React, { Component } from 'react';

import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

class Editor extends Component {
  state = {
    editorState: BraftEditor.createEditorState(null),
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { value } = this.props;
    this.setState({
      editorState: BraftEditor.createEditorState(value),
    });
  }

  submitContent = async () => {
    const { onChange } = this.props;
    const { editorState } = this.state;
    onChange(editorState.toHTML());
  };

  handleEditorChange = editorState => {
    this.setState({ editorState });
    const { onChange } = this.props;
    onChange(editorState.toHTML());
  };

  render() {
    const { editorState } = this.state;
    return (
      <BraftEditor
        value={editorState}
        onChange={this.handleEditorChange}
        onSave={this.submitContent}
      />
    );
  }
}

export default Form.create()(Editor);
