import React, { Component } from "react";
import "./Voterlogin.css";
import firebase from "./Componet/firebase";
import "antd/dist/antd.css";
import { Link } from "react-router-dom";
import { Layout, Row, Col } from "antd";
const { Content } = Layout;

class Voterlogin extends Component {
  state={
    phone: '',
    id_num: '',
    show_error_phone: false,
    show_error_id: false,
    loading: true
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        //user is logged in
        this.props.history.push('/home');
        
      }else{
        this.setState({loading: false});
      }
    })
  }
  handleClick = () => {
    if(this.state.phone === ""){
      this.setState({show_error_phone: true})
    }else if(this.state.id_num === ""){
      this.setState({show_error_id: true})
    }else{
      //911943600
      let recaptcha = new firebase.auth.RecaptchaVerifier("recaptcha");
      let number ="+251"+this.state.phone;
      firebase
        .auth()
        .signInWithPhoneNumber(number, recaptcha)
        .then(function (e) {
          let code = prompt("Enter otp", "");
          if (code == null) return;
          e.confirm(code)
            .then(function (result) {
              this.props.history.push('/home');
            })
            .catch(function (error) {
              console.log(error.messsage);
            });
        })
        .catch(function (error) {
         console.log(error.messsage);
        });
    }
  };

  render() {
    return (
      this.state.loading ? <h2>Loading ...</h2> :(
      <div>
        <Layout className="login-layout">
          <Content className="login-content">
            <Row style={{ height: "100vh" }}>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xs={24}
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="title-con">
                  <p className="header">Peer Vote</p>
                  <p className="sec-header">Log in to Vote</p>
                </div>
                <div className="login-con">
              
                    <input
                      className="phonenum"
                      type="number"
                      
                      name="Phone"
                      placeholder="Phone Number"
                      onChange={e => this.setState({phone: e.target.value,show_error_phone: false})}
                    />
                    {this.state.show_error_phone ? (
                    <p className="error-text">Phone Can't be empty</p> ): ""}
                    
                    <input
                      className="idno"
                      type="text"
                      name="idno"
                      placeholder="ID Number"
                      onChange={e => this.setState({id_num: e.target.value,show_error_id: false})}
                    />
                    {this.state.show_error_id ? 
                     <p className="error-text">Id number Can't be empty</p> :
                     ""}
                    <div  id="recaptcha"></div>
                    <button
                      onClick={this.handleClick}
                      type="submit"
                      className="loginbtn"
                    >
                      Login
                    </button>
                  
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

export default Voterlogin;
