import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Icon, Loading, Feedback } from '@icedesign/base';
import { Link, Router, Route } from 'react-router-dom';
import CourseDetail from '../../../CourseDetail/CourseDetail';
import axios from 'axios';
import ud from '../../../../utilities/UrlDictionary';

export default class ArticleList extends Component {
  static displayName = 'ArticleList';

  constructor(props) {
    super(props);
    this.state = {
      listVisible: true,
      results: [
        {
            "id": 2,
            "title": "大学美育",
            "teachers": [],
            "course_type": "人文科学核心",
            "department": "新闻与传播学院"
        },
        {
            "id": 9,
            "title": "大学语文",
            "teachers": [],
            "course_type": "人文科学核心",
            "department": "新闻与传播学院"
        }
      ]
    };
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <Loading style={{display: "block"}} visible={!this.state.listVisible} shape="dot-circle">
      <div className="article-list">
        <IceContainer>
          {this.props.results.map((item, index) => {
            return (
              <div key={index} style={styles.articleItem}>
                <div>
                  <Link style={styles.title} to={"/course/"+item.id}>{item.title}</Link>
                </div>
                <div>
                  <p style={styles.desc}></p>
                </div>
                <div style={styles.articleItemFooter}>
                  <div style={styles.articleItemTags}>
                    <span
                      key="-2"
                      className="article-item-tag"
                      style={styles.tag}
                    >
                      {item.course_type}
                    </span>
                    <span
                      key="-1"
                      className="article-item-tag"
                      style={styles.tag}
                    >
                      {item.department}
                    </span>
                    {item.teachers.map((teacher, idx) => {
                      return (
                        <span
                          key={idx}
                          className="article-item-tag"
                          style={styles.tag}
                        >
                          教师姓名
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
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
    marginBottom: '30px',
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
