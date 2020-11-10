import React, { Component } from "react";
import "./Home.css";
import user from "./Images/user.svg";
import firebase from "./firebase";
import "antd/dist/antd.css";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Row, Col, Avatar, Radio,Image , Input } from "antd";
import {Redirect } from 'react-router-dom'
//cand image
import ca from './Images/01.jpg'
import cb from './Images/02.jpg'
import cc from './Images/03.jpg'
import cd from './Images/04.jpg'
import ce from './Images/05.jpg'
import cf from './Images/06.jpg'

const { Content } = Layout;
const axios = require('axios');

class Home extends Component {
  state = {
    value: 0,
    voted: false,
    loading: false,
    votes:{}
  };
    
  componentDidMount(){
    
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        //check if user has voted
       
        axios.post('http://localhost:4000/checkUser', {
          id: user.phoneNumber//this.state.phone.phoneNumber
        })
        .then((response) => {
          if(response.data === true){
            this.setState({voted: true})
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }else{
       this.props.history.push('/');
      }
    })
    
    //get votes
    axios.get('http://localhost:4000/getVotes')
    .then((response) => {    
      var count = {};
      response.data.forEach(function(i) { 
        count[i] = ( count[i] || 0 ) + 1;
      });
      this.setState({votes:count})
    })
    .catch(function (error) {
      console.log(error);
    });
    this.setState({loading: false})    
  }

  logOut() {
    firebase.auth().signOut();
  }
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  voteClicked = () => {
    if(this.state.value === 0){
      return alert('you must first select a candidate to vote')
    }
   axios.post('http://localhost:4000/vote', {
      cand: this.state.value, 
      hasVoted: this.state.phone.phoneNumber
    })
    .then((response) => {
      alert('Voted')
      this.setState({voted: true})
    
    })
    .catch(function (error) {
      console.log(error);
    });
    //this.setState({ voted: true });*/
    //alert(this.state.value)
  };
  
  render() {
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    const { value } = this.state;
    return (
      this.state.loading ? <h2>Loading ...</h2> :(
      <div>
        <Layout className="home-layout">
          <Content className="home-content">
            <Row style={{ height: "100vh" }}>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xs={24}
                style={{ backgroundColor: "#ffffff" }}
              >
               
                <div className="party-con">
                  {this.state.voted ? (
                    <div className="party-list">
                      <div className="left-list-container">
                        <ul>
                          <li className="left-list">
                            <Avatar size={80}  src={ca}/>
                            <p className="left-radio-btn">
                              Joe Biden ( {this.state.votes["Joe Biden"]} Votes)
                            </p>
                          </li>
                          <li className="left-list">
                            <Avatar size={80} src={cb} />
                            <p className="left-radio-btn">
                            Bernie Sanders ({this.state.votes["Bernie Sanders"]} Votes)
                            </p>
                              
                          </li>
                          <li className="left-list">
                            <Avatar size={80} src={cc} />
                            <p className="left-radio-btn">
                              Tulsi Gabbard ({this.state.votes["Tulsi Gabbard"]} Votes)
                              </p>
                          </li>
                        </ul>
                      </div>
                      <div className="right-list-container">
                        <ul>
                          <li className="right-list">
                            <Avatar size={80} src={cd} />
                            <p className="right-radio-btn">
                               Donald Trump ({this.state.votes["Donald Trump"]} Votes)
                            </p>
                          </li>
                          <li className="right-list">
                            <Avatar size={80} src={ce} />
                            <p className="right-radio-btn">
                              Elizabeth Warren ({this.state.votes["Elizabeth Warren"]} Votes)
                              </p>
                          </li>
                          <li className="right-list">
                            <Avatar size={80} src={cf} />
                            <p className="right-radio-btn">
                              Amy Klobuchar ({this.state.votes["Amy Klobuchar"]} Votes)
                              </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Radio.Group
                      onChange={this.onChange}
                      value={value}
                      className="party-list"
                    >
                      <div className="left-list-container">
                        <ul>
                          <li className="left-list">
                            <Avatar size={80}  src={ca}/>
                            <Radio
                              style={radioStyle}
                              className="left-radio-btn"
                              value={'Joe Biden'}
                            >
                              Joe Biden
                            </Radio>
                          </li>
                          <li className="left-list">
                            <Avatar size={80} src={cb} />
                            <Radio
                              style={radioStyle}
                              value={'Bernie Sanders'}
                              className="left-radio-btn "
                            >
                              Bernie Sanders
                            </Radio>
                          </li>
                          <li className="left-list">
                            <Avatar size={80} src={cc} />
                            <Radio
                              style={radioStyle}
                              value={'Tulsi Gabbard'}
                              className="left-radio-btn "
                            >
                              Tulsi Gabbard
                            </Radio>
                          </li>
                        </ul>
                      </div>
                      <div className="right-list-container">
                        <ul>
                          <li className="right-list">
                            <Avatar size={80} src={cd} />
                            <Radio
                              style={radioStyle}
                              value={'Donald Trump'}
                              className="right-radio-btn"
                            >
                              Donald Trump
                            </Radio>
                          </li>
                          <li className="right-list">
                            <Avatar size={80} src={ce} />
                            <Radio
                              style={radioStyle}
                              value={'Elizabeth Warren'}
                              className="right-radio-btn"
                            >
                              Elizabeth Warren
                            </Radio>
                          </li>
                          <li className="right-list">
                            <Avatar size={80} src={cf} />
                            <Radio
                              style={radioStyle}
                              value={'Amy Klobuchar'}
                              className="right-radio-btn"
                            >
                              Amy Klobuchar
                            </Radio>
                          </li>
                        </ul>
                      </div>
                    </Radio.Group>
                  )}
                </div>
                <div className="votebtn-con">
                  {this.state.voted ? (
                    <button
                      type="submit"
                      className="votebtn"
                      onClick={() => this.logOut()}
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="votebtn"
                      onClick={() => this.voteClicked()}
                    >
                      Vote
                    </button>
                  )}
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </div>
      )
    );
  }
}

export default Home;
