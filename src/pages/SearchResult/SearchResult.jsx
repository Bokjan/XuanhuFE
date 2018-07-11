import React, { Component } from 'react';
import ArticleList from './components/ArticleList';
import { Grid, Icon, Button, Dialog, Feedback } from "@icedesign/base";
const { Row, Col } = Grid;

import ud from "../../utilities/UrlDictionary";
import axios from "axios";

import IceTitle from '@icedesign/title';
import IceIcon from '@icedesign/icon';

export default class SearchResult extends Component {
  static displayName = 'SearchResult';

  constructor(props) {
    super(props);
    this.state = {
      results: [],
      lastKeyword: this.getSearchKeyword(),
      feedbackDialogVisible: false
    };
  }

  getSearchKeyword() {
    return decodeURI(window.location.hash.split("/")[2]);
  }

  componentDidMount() {
    let keyword = this.getSearchKeyword();
    this.setState({
      lastKeyword: keyword
    });
    let url = ud.getInstance().api("search");
    axios.post(url, {
      keyword: keyword
    }).then(r => {
      const {data} = r;
      this.setState({
        results: data
      });
      if(data.length == 0) {
        this.setState({
          feedbackDialogVisible: true
        });
      }
    }).catch(e => {
      Feedback.toast.error("搜索失败");
    });
  }

  componentDidUpdate() {
    if(this.state.lastKeyword != this.getSearchKeyword()) {
      this.componentDidMount();
    }
  }

  onFeedbackConfirmButtonClick() {
    setTimeout(() => { Feedback.toast.success("报告成功！") }, 500); // 500ms 后显示 toast
  }

  generateFeedbackDialog() {
    const footer = (
      <Button type="primary" onClick={this.onFeedbackConfirmButtonClick.bind(this)}>确定</Button>
    );
    return (
      <Dialog
        title="Oops..."
        animation={{ in: 'fadeInDown', out: 'fadeOutUp' }}
        onCancel={()=>{this.setState({feedbackDialogVisible: false});}}
        onOk={()=>{this.onFeedbackConfirmButtonClick();this.setState({feedbackDialogVisible: false});}}
        visible={this.state.feedbackDialogVisible}
      >
        <p>看起来没有相关的搜索结果……</p>
        <p>要将这个不成功的搜索上报给管理员吗？</p>
      </Dialog>
    );
  }

  render() {
    return (
      <div className="SearchResult-page">
      <Row>
        <Col span="3"/>
        <Col span="18">
          <IceTitle>
          「{this.state.lastKeyword}」搜索结果<Icon type="lights" />
          </IceTitle>
          <ArticleList results={this.state.results} />
        </Col>
        <Col span="3"/>
      </Row>
      {this.generateFeedbackDialog()}
      </div>
    );
  }
}
