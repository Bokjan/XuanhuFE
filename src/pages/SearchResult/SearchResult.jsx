import React, { Component } from 'react';
import ArticleList from './components/ArticleList';
import { Grid } from "@icedesign/base";
const { Row, Col } = Grid;

import ud from "../../utilities/UrlDictionary";
import axios from "axios";

export default class SearchResult extends Component {
  static displayName = 'SearchResult';

  constructor(props) {
    super(props);
    this.state = {};
  }

  getSearchKeyword() {
    window.location.hash.split("/")[2];
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    console.log("didupdate");
  }

  render() {
    return (
      <div className="SearchResult-page">
      <Row>
        <Col span="3"/>
        <Col span="18">
          <ArticleList />
        </Col>
        <Col span="3"/>
      </Row>
      </div>
    );
  }
}
