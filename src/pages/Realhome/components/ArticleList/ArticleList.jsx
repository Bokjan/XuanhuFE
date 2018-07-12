import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Icon, Loading, Feedback } from '@icedesign/base';
import { Link, Router, Route } from 'react-router-dom';
import CourseDetail from '../../../CourseDetail/CourseDetail';
import axios from 'axios';
import ud from '../../../../utilities/UrlDictionary';
import ReactMarkdown from 'react-markdown';

export default class ArticleList extends Component {
  static displayName = 'ArticleList';

  constructor(props) {
    super(props);
    this.state = {
      listVisible: false,
      currentPage: 0, 
      comments: []
    };
  }

  loadMoreComments() {
    let page = this.state.currentPage + 1;
    axios.get(ud.getInstance().api("latestComments") + "?page=" + page).then(response => {
      const {data} = response;
      if(data.length == 0) {
        Feedback.toast.success("已经到底啦~");
      }
      this.setState({
        comments: this.state.comments.concat(data),
        listVisible: true,
        currentPage: page
      });
    }).catch(e => {
      Feedback.toast.error("服务器错误，请稍后刷新。");
    });
  }

  componentDidMount() {
    this.loadMoreComments();
  }

  render() {
    return (
      <Loading style={{display: 'block'}} visible={!this.state.listVisible} shape="dot-circle">
      <div className="article-list">
        <IceContainer style={styles.articleFilterCard}>
             <span style={styles.sortItem}><Icon type="filter" size="medium" />&nbsp;最新评论</span>
        </IceContainer>
        <IceContainer>
          {this.state.comments.map((item, index) => {
            return (
              <div key={index} style={styles.articleItem}>
                <div>
                  <Link style={styles.title} to={"/course/"+item.course.id}>{item.course.title + " - " + item.user.name}</Link>
                </div>
                <div>
                <ReactMarkdown source={item.content} />
                </div>
                <div style={styles.articleItemFooter}>
                  <div style={styles.articleItemMeta}>
                    <span style={styles.itemMetaIcon}>
                      <Icon type="good" size="small" /> {item.voteUp}
                    </span>
                    <span style={styles.itemMetaIcon}>
                      <Icon type="bad" size="small" /> {item.voteDown}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <p align="center" style={{color: "#86b4fe", cursor: "pointer"}} onClick={this.loadMoreComments.bind(this)}>加载更多评论</p>
        </IceContainer>
      </div>
      </Loading>
    );
  }
}

const styles = {
  articleFilterCard: {
    marginBottom: '10px',
    minHeight: 'auto',
    padding: 0,
  },
  articleSort: {
    margin: 0,
    padding: 0,
  },
  sortItem: {
    cursor: 'pointer',
    listStyle: 'none',
    fontSize: '14px',
    float: 'left',
    whiteSpace: 'nowrap',
    padding: '20px',
  },
  articleItem: {
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #f5f5f5',
  },
  title: {
    fontSize: '16px',
    color: '#333',
    textDecoration: 'none',
  },
  desc: {
    lineHeight: '24px',
    fontSize: '14px',
    color: '#999',
  },
  articleItemFooter: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    fontSize: '13px',
    background: '#f5f5f5',
    color: '#999',
    padding: '4px 15px',
    borderRadius: '20px',
    marginRight: '20px',
  },
  articleItemTags: {
    padding: '10px 0',
  },
  articleItemMeta: {
    padding: '10px 0',
    float: 'right'
  },
  itemMetaIcon: {
    fontSize: '14px',
    color: '#999',
    marginRight: '15px',
  },
};
