import React, { Component } from 'react';

/*********************************************** */
import { Grid, Feedback } from "@icedesign/base";
const { Row, Col } = Grid;

import Img from '@icedesign/img';
import ArticleList from './components/ArticleList';
import IceContainer from '@icedesign/container';
import { Button, Tab, Loading } from '@icedesign/base';
const { TabPane } = Tab;
/*********************************************** */

import ud from "../../utilities/UrlDictionary";
import axios from "axios";


export default class UserInfo extends Component {
  static displayName = 'User Information';

  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        name: "用户名",
        description: "用户简介",
        avatar_url: null
      },
      upperVisible: false,
      commentList: [],
      upvoteList: [],
      downvoteList: [],
      lastUserId: this.getUserId()
    };
  }

  getUserId() {
    let arr = window.location.hash.split("/");
    if (arr[1] == "user") {
      return arr[2];
    } else {
      let info = JSON.parse(window.localStorage.getItem("user_info"));
      if (info != undefined && info != null) {
        return info.id;
      } else {
        return -1;
      }
    }
  }

  onCommentListClick() {
    if (this.state.commentList.length != 0) {
      return;
    }
    let url = ud.getInstance().concat("api/users/" + this.getUserId() + "/comments");
    axios.get(url).then(r => {
      const { data } = r;
      this.setState({
        commentList: data
      });
    }).catch(e => {
      Feedback.toast.error("网络访问失败");
    });
  }

  onUpvoteDownvoteListClick() {
    if (this.state.upvoteList.length != 0) {
      return;
    }
    let url = ud.getInstance().concat("api/users/" + this.getUserId() + "/votes");
    axios.get(url).then(r => {
      const { data } = r;
      var up = [];
      var down = [];
      data.forEach(item => {
        if (item.voteValue == 1) {
          up.push(item);
        } else {
          down.push(item);
        }
      });
      this.setState({
        upvoteList: up,
        downvoteList: down
      })
    }).catch(e => {
      Feedback.toast.error("网络访问失败");
    });
  }

  loadInfo() {
    let url = ud.getInstance().concat("api/users/" + this.getUserId());
    axios.get(url).then(r => {
      const { data } = r;
      this.setState({
        userInfo: data,
        upperVisible: true,
        commentList: [],
        upvoteList: [],
        downvoteList: []
      });
    }).catch(e => {
      window.location.replace("/#/notfound");
    });
  }

  componentDidMount() {
    this.loadInfo();
    this.onCommentListClick();
  }

  componentDidUpdate() {
    if(this.state.lastUserId != this.getUserId()) {
      this.setState({
        lastUserId: this.getUserId()
      });
      this.componentDidMount();
    }
  }

  render() {
    var isSameUser = false;
    let info = JSON.parse(window.localStorage.getItem("user_info"));
    if ((info != undefined && info != null) && info.id == this.getUserId()) {
      isSameUser = true;
    }
    var whoseInfo = isSameUser ? "我的" : "Ta的";
    return (
      <div>
        <Row >
          <Col span='3' />
          <Col span="18">
            <Loading style={{ display: 'block' }} visible={!this.state.upperVisible} shape="dot-circle">
              <IceContainer id="parentContainer">
                <Row>
                  <Col span='19' height={150}>
                    <span>
                      <Img
                        src={this.state.userInfo.avatar_url == null ? "//img.alicdn.com/tfs/TB1nf.WjyqAXuNjy1XdXXaYcVXa-245-245.gif" : this.state.userInfo.avatar_url}
                        shape="rounded"
                        type="cover"
                        width={150}
                        height={150}
                        style={{ marginRight: "20px", float: 'left' }}
                      />
                      <h1 style={{ fontSize: '40px', marginLeft: '10px', marginTop: "60px" }}>
                        {this.state.userInfo.name}
                      </h1>
                      <h3 style={{ fontSize: '20px', marginLeft: '10px' }}>
                        {this.state.userInfo.description}
                      </h3>
                    </span>
                  </Col>
                  {/* <Col span='2'/> */}
                  <Col span='5'>
                    {isSameUser ? <Button
                      size="large"
                      shape="ghost"
                      component="a"
                      style={{ marginTop: "120px" }}
                      href="/#/userinfo"
                    ><span>编辑个人资料</span></Button> : <span />}
                  </Col>
                </Row>
              </IceContainer>
            </Loading>
          </Col>
          <Col span='3' />px
        </Row>
        <Row>
          <Col span='3' />
          <Col span='18'>
            <IceContainer>
              <Tab size="small" type="wrapped">
                <TabPane onClick={this.onCommentListClick.bind(this)} key="comments" tab={whoseInfo + "评论"}>
                  <ArticleList comments={this.state.commentList} />
                </TabPane>
                <TabPane onClick={this.onUpvoteDownvoteListClick.bind(this)} key="upvote" tab={whoseInfo + "赞同"}>
                  <ArticleList comments={this.state.upvoteList} />
                </TabPane>
                <TabPane onClick={this.onUpvoteDownvoteListClick.bind(this)} key="downvote" tab={whoseInfo + "反对"}>
                  <ArticleList comments={this.state.downvoteList} />
                </TabPane>
              </Tab>
            </IceContainer>
          </Col>

          <Col span='3' />
        </Row>

      </div>);
  }
}


const styles = {
};