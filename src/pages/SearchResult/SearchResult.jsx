import React, { Component } from 'react';
import ArticleList from './components/ArticleList';
import { Grid, Icon } from "@icedesign/base";
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
      lastKeyword: this.getSearchKeyword()
    };
  }

  getSearchKeyword() {
    return decodeURI(window.location.hash.split("/")[2]);
  }

  componentDidMount() {
    let keyword = this.state.lastKeyword;
    let url = ud.getInstance().api("search");
    axios.post(url, {
      keyword: keyword
    }).then(r => {
      const {data} = r;
      this.setState({
        results: data
      });
      console.log(data);
    }).catch(e => {
      Feedback.toast.error("搜索失败");
    });
  }

  componentDidUpdate() {
    if(this.state.lastKeyword != this.getSearchKeyword()) {
      this.setState({
        lastKeyword: this.getSearchKeyword()
      });
      this.componentDidMount();
    }
  }

  render() {
    return (
      <div className="SearchResult-page">
      <Row>
        <Col span="3"/>
        <Col span="18">
          <IceTitle>
            搜索结果 - “{this.state.lastKeyword}” <Icon type="lights" />
          </IceTitle>
          <ArticleList results={this.state.results} />
        </Col>
        <Col span="3"/>
      </Row>
      </div>
    );
  }
}
