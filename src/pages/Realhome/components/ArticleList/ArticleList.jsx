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
      comments: [{
          course: {
            id: 1,
            title: "软件综合开发实训"
          },
          user: {
            name: "林连南"
          },
          content:
            '冯玉翔：博士，讲师。研究方向：网络信息安全、物联网、移动计算。教学科研情况：先后承担了本科多门课程的教学工作，并完成了与微软、苹果公司合作的精品课程建设。先后主持三项省级科研项目，发表多篇科研论文。',
          voteUp: 66666,
          voteDown: 66666,
        }, {
          course: {
            id: 1,
            title: "软件需求分析、设计与建模"
          },
          user: {
            name: "林连北"
          },
          content:
            '林连南，中科院软件与理论专业博士，讲师。研究方向：软件工程与智能人机交互技术。个人荣誉：多次获得省级、国家级软件比赛一等奖；授课主讲软件需求分析、设计与建模，软件体系结构，智能人机交互技术；指导核心软件工程实践课程；项目：主持科研、教研、企业和政府项目近15项；指导学生研究项目，国家级学生创新创业项目近20项。',
          voteUp: 233,
          voteDown: 114514,
        }, {
          course: {
            id: 1,
            title: "数据库系统"
          },
          user: {
            name: "林连东"
          },
          content:
            '曾兵，博士，讲师。研究方向：密码学协议，特别是安全多方计算和秘密共享两个子领域。致力于为云计算、大数据、区块链等现实应用构造可证明安全的、高效的、实用的密码学协议。主要业绩：在国际学术期刊上发表SCI论文多篇，其中CCF A类1篇，B类1篇；正在主持或者已经完成5个省市校各级科研项目。',
          voteUp: 233,
          voteDown: 114514,
        }]
    };
  }

  componentDidMount() {
    axios.get(ud.getInstance().api("latestComments")).then(response => {
      const {data} = response;
      this.setState({
        comments: data,
        listVisible: true
      });
    }).catch(e => {
      Feedback.toast.error("服务器错误，请稍后刷新。");
    });
  }

  render() {
    return (
      <Loading style={{display: 'block'}} visible={!this.state.listVisible} shape="dot-circle">
      <div className="article-list">
        {/* <IceContainer style={styles.articleFilterCard}>
          <ul className="article-sort" style={styles.articleSort}>
            <li style={styles.sortItem}>
              最新 <Icon type="arrow-down" size="xs" />
            </li>
            <li style={styles.sortItem}>
              最热 <Icon type="arrow-down" size="xs" />
            </li>
          </ul>
        </IceContainer> */}
        {/* <IceContainer style={styles.articleFilterCard}>
          <ul className="article-sort" style={styles.articleSort}>
            <li style={styles.sortItem}>
              <Icon type="operation" size="xs" />最新评论
            </li>
          </ul>
        </IceContainer> */}
        <IceContainer>
          {this.state.comments.map((item, index) => {
            return (
              <div key={index} style={styles.articleItem}>
                <div>
                  <Link style={styles.title} to={"/course/"+item.course.id}>{item.course.title + " - " + item.user.name}</Link>
                  <Route path="/course/:courseId" component={CourseDetail}/>
                </div>
                <div>
                <ReactMarkdown source={item.content} />
                </div>
                <div style={styles.articleItemFooter}>
                  {/* <div style={styles.articleItemTags}>
                    {item.tags.map((tag, idx) => {
                      return (
                        <span
                          key={idx}
                          className="article-item-tag"
                          style={styles.tag}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div> */}
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
