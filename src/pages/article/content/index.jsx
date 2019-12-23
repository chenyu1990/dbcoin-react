import React, { Fragment } from 'react';
import { Button, Upload, Card, Icon, Divider, message } from 'antd';
import { connect } from 'dva';
import * as API from '@/api';
import store from '@/utils/store';

import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';

const mediaTypeMap = ['MEDIA', 'IMAGE', 'VIDEO', 'AUDIO'];

@connect(({ article, attachment, loading }) => ({
  article,
  attachment,
  loading: loading.models.article,
}))
export default class ArticleDetail extends React.Component {
  state = {
    article: {
      title: '',
      content: '',
    },
    mediaItems: [],
    fileList: [],
    editorState: BraftEditor.createEditorState(null),
  };

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const { dispatch } = this.props;
    this.braftFinder = this.editorInstance.getFinderInstance();

    dispatch({
      type: 'article/get',
      payload: id,
      callback: article => {
        const { fileList } = this.state;
        if (article.media) {
          fileList.push({
            uid: '1',
            name: `媒体：${article.media}`,
            status: 'done',
            url: `${API.DATA.ATTACHMENT}/${article.media}`,
          });
        }
        if (article.image) {
          fileList.push({
            uid: '2',
            name: `图片：${article.image}`,
            status: 'done',
            url: `${API.DATA.ATTACHMENT}/${article.image}`,
          });
        }
        if (article.thumb) {
          fileList.push({
            uid: '3',
            name: `缩略图：${article.thumb}`,
            status: 'done',
            url: `${API.DATA.ATTACHMENT}/${article.thumb}`,
          });
        }
        this.setState({
          article,
          fileList,
          editorState: BraftEditor.createEditorState(article.content),
        });

        dispatch({
          type: 'attachment/fetch',
          payload: {
            related_id: article.id,
          },
          callback: response => {
            if (response.status === 200) {
              const {
                attachment: {
                  data: { [article.id]: items },
                },
              } = this.props;
              const { mediaItems } = this.state;
              items.map(item => {
                mediaItems.push({
                  id: item.id,
                  type: mediaTypeMap[item.type],
                  url: `${API.DATA.ATTACHMENT}/${item.image}`,
                });
              });
              this.setState({ mediaItems });
            }
          },
        });
      },
    });
  }

  // 添加到编辑器
  insertMediaItem = items => {
    const editorState = ContentUtils.insertMedias(this.state.editorState, items);
    this.setState({ editorState });
  };

  handleChange = editorState => {
    this.setState({
      editorState,
    });
  };

  isVideo = file => {
    const { type } = file;
    return type === 'video/mp4';
  };

  isAudio = file => {
    const { type } = file;
    return type === 'audio/mp3';
  };

  isImage = file => {
    const { type } = file;
    return type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif';
  };

  isMedia = file => {
    return this.isVideo(file) || this.isAudio(file);
  };

  fileUpload = ({ file, progress, success, error }) => {
    const { dispatch } = this.props;
    const {
      article: { id },
    } = this.state;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('related_id', id);
    dispatch({
      type: 'attachment/add',
      payload: formData,
      callback: ({ response, data }) => {
        if (response.status === 200) {
          success({
            id: data.id,
            type: mediaTypeMap[data.type],
            url: `${API.DATA.ATTACHMENT}/${data.image}`,
          });
        }
      },
    });
  };

  handleFileChange = ({ file, fileList }) => {
    switch (file.status) {
      case 'error':
        message.error(`${file.name} 上传失败`);
        break;
      case 'done':
        message.success(`${file.name} 上传成功`);
        const {
          article: { media, image },
        } = this.state;
        const {
          response: { image: data },
        } = file; // attachment 表的 image 字段，应该改为data字段
        const newMedia = this.isMedia(file) ? data : media;
        const newImage = this.isImage(file) ? data : image;
        this.setState({
          article: {
            ...this.state.article,
            media: newMedia,
            image: newImage,
          },
          fileList: fileList,
        });
        this.submitContent();
        break;
    }
  };

  submitContent = () => {
    const { article, editorState } = this.state;
    const { dispatch } = this.props;
    article.content = editorState.toHTML();
    dispatch({
      type: 'article/update',
      payload: article,
    });
  };

  render() {
    const {
      article: { id, title },
      fileList,
      editorState,
      mediaItems,
    } = this.state;
    const { token_type, access_token } = store.getAccessToken();
    return (
      <Card title={title}>
        <BraftEditor
          ref={instance => (this.editorInstance = instance)}
          value={editorState}
          media={{
            items: mediaItems,
            uploadFn: this.fileUpload,
            onInsert: this.insertMediaItem,
            pasteImage: true,
            accepts: {
              image: '.gif,.png,.jpg',
              video: '.mp4',
              audio: '.mp3',
            },
          }}
          onChange={this.handleChange}
          onSave={this.submitContent}
        />
        <Button style={{ marginTop: 16 }} onClick={this.submitContent}>
          提交(^S)
        </Button>
        <Divider type="vertical" />
        <Upload
          name="file"
          defaultFileList={fileList}
          headers={{
            authorization: `${token_type} ${access_token}`,
          }}
          data={{
            related_id: id,
          }}
          action={API.ATTACHMENT.MAIN}
          onChange={this.handleFileChange}
        >
          <Button>
            <Icon type="upload" />
            上传顶部媒体
          </Button>
        </Upload>
      </Card>
    );
  }
}
