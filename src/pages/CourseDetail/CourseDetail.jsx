import React, { Component } from 'react';
import ArticleList from './components/ArticleList';

/*********************************************** */
import { Grid, Loading, Feedback } from "@icedesign/base";
const { Row, Col } = Grid;

import { Card,Timeline, Accordion, Input, Button } from "@icedesign/base";
const { Item: TimelineItem } = Timeline;
const { Panel } = Accordion;

import axios from 'axios';
import ud from '../../utilities/UrlDictionary';

// import {MarkdownInput, PlainMarkdownInput} from '@opuscapita/react-markdown';

/*********************************************** */

export default class CourseDetail extends Component {
  static displayName = 'Course Detail';

  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      courseInfo: {
        title: '课程名',
        teachers: [{
          'name': '姓名',
        }],
        department: {
          "name": "软件学院"
        },
        course_type: "专业必修课",
        intro: '林连南，中科院软件与理论专业博士，讲师。研究方向：软件工程与智能人机交互技术。个人荣誉：多次获得省级、国家级软件比赛一等奖；授课主讲软件需求分析、设计与建模，软件体系结构，智能人机交互技术；指导核心软件工程实践课程；项目：主持科研、教研、企业和政府项目近15项；指导学生研究项目，国家级学生创新创业项目近20项。'
      },
      courseInfoVisible: false,
      generalEditorButtonLoading: false,
      lastCourseId: this.getCourseId()
    };
  }

  getCourseId() {
    var arr = window.location.hash.split("/");
    return arr[2];
  }

  getCourseCommentsApiUrl(id) {
    return ud.getInstance().concat("api/courses/" + id + "/comments");
  }

  getCourseInfoApiUrl(id) {
    return ud.getInstance().concat("api/courses/" + id);
  }

  onClickAddComment(e) {
    const content = document.getElementById("generalEditor").value;
    if(content.length < 10) {
      Feedback.toast.error("字数过少");
      return;
    }
    this.setState({
      generalEditorButtonLoading: true
    });
    axios.post(this.getCourseCommentsApiUrl(this.getCourseId()), {
      content: content,
    }).then(response => {
      Feedback.toast.success("发布成功！");
      window.location.reload();
    }).catch(e => {
      Feedback.toast.error("发布失败！");
      this.setState({
        generalEditorButtonLoading: false
      });
    });
  }

  generateGeneralEditor() {
    return (
      <Accordion style={{ marginTop: "20px" }}>
        <Panel expanded={this.state.generalEditorButtonLoading} title="发表新评论">
          <Input id="generalEditor" placeholder="支持 Markdown 语法" size="medium" multiple style={{width: "100%"}} rows="12" />
          <Button type="primary" loading={this.state.generalEditorButtonLoading} onClick={this.onClickAddComment.bind(this)}>提交</Button>
        </Panel>
      </Accordion>
    );
  }

  componentDidMount() {
    axios.get(this.getCourseInfoApiUrl(this.getCourseId())).then(response=> {
      const {data} = response;
      this.setState({
        courseInfo: data, 
        courseInfoVisible: true
      });
    }).catch(e => {
      window.location.replace("/#/notfound")
    });
    axios.get(this.getCourseCommentsApiUrl(this.getCourseId())).then(response=> {
      const {data} = response;
      this.setState({
        comments: data, 
      });
    }).catch(e => {
      Feedback.toast.error("评论加载失败，请重试！");
    });
  }

  componentDidUpdate() {
    if(this.state.lastCourseId != this.getCourseId()) {
      this.setState({
        lastCourseId: this.getCourseId()
      });
      this.componentDidMount();
    }
  }

  courseInfo() {
    var teacherNameListStr = "暂无信息";
    if(this.state.courseInfo.teachers.length != 0) {
      teacherNameListStr = this.state.courseInfo.teachers[0].name;
      for(var i = 1; i < this.state.courseInfo.teachers.length; ++i) {
        teacherNameListStr += "、" + this.state.courseInfo.teachers[i].name;
      }
    }
    return (
    <Loading visible={!this.state.courseInfoVisible} shape="fusion-reactor">
    <Row>
      <Col span='3'></Col>
        <Col span='7'>
          <Card style={{ width: '100%' }}
            title={this.state.courseInfo.title}
          >
            <Timeline>
              <TimelineItem title={"授课教师：" + teacherNameListStr} />
              <TimelineItem title={"开课学院：" + this.state.courseInfo.department.name} />
              <TimelineItem title={"课程类型：" + this.state.courseInfo.course_type} />
            </Timeline>
          </Card>
        </Col>
        <Col span='1'/>
        <Col span='10'>
          <Card 
            title="课程简介"
        >
          <p>{this.state.courseInfo.intro}</p>
          </Card>
        </Col>
      <Col span="3"></Col>
    </Row>
    </Loading>);
  }

  render() {
    return (
    <div>
      {this.courseInfo()}
      <Row>
        <Col span="3"></Col>
        <Col span="18">
          {this.generateGeneralEditor()}
        </Col>
        <Col span="3"></Col>
      </Row>
      <Row>
        <Col span="3"></Col>
        <Col span="18">
          <div className="coursepage-page">
            <ArticleList comments={this.state.comments} />
          </div>
        </Col>
        <Col span="3"></Col>
      </Row>
    </div>);
  }
}
