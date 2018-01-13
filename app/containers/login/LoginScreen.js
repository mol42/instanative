import React, { Component } from 'react'
import { View, Image, TextInput, ImageBackground } from 'react-native'
import Button from 'react-native-button';
import BaseScreen from "../BaseScreenRN";
import ErrorMessage from "../../components/ErrorMessage";
// redux
import { connect } from "react-redux";
import { tryAutoLogin, tryLogin, updateLoginForm } from "../../redux/auth/Actions";

const styles = {
  input : {
    flex: 1, 
    color: "#fff", 
    height: 50, 
    marginLeft: 50, 
    marginRight : 50, 
    padding: 10, 
    borderWidth : 0.5, 
    borderColor : "#eee"
  }
}

export class LoginScreen extends BaseScreen {

  static navigationOptions = { 
    header: null, 
    tabBarVisible: false 
  }
  isVisible = false;

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // this.props.tryAutoLogin();
  }

  /**
   * saga login işlemini tamamladığı zaman yeni verilerin redux veri ağacına
   * set edilmesini sağlar ve güncellenen redux veri ağacı değişimi
   * dinleyen komponentlere gönderir. O anda aktif ekran login olduğu için
   * login başarılı ise ana ekrana gideriz.
   * 
   */
  componentWillReceiveProps(newProps) {
    let {loginInProgress, loginCompleted, loginHasError, user} = newProps.auth;
    const {state} = this.props.navigation;

    if (!loginInProgress && loginCompleted && !loginHasError && user.id > 0 && !this.isVisible) {
      this.navigateToScreen('HomeScreen');
      this.isVisible = true;
    }
  }

  render() {
    let {loginCompleted, loginHasError, loginForm} = this.props.auth;
    let {email, password} = loginForm;

    return <ImageBackground imageStyle={{resizeMode: "stretch", width: null, height: null}} 
                            source={require("../../images/login-bg-2.jpg")} 
                            style={{flex: 1, backgroundColor : "black"}}>
              <View style={{flex: 1, alignItems : "center", justifyContent : "center"}}>
                <Image source={require("../../images/insta-logo.png")} style={{width: 125, height: 125}} />
                <Image source={require("../../images/Instagram_logo.svg.png")} style={{width: 120, height : 36, marginTop: 20}} />
              </View>
              <View style={{flex: 1}}>
                <View style={{height: 50}}>
                    <TextInput autoCapitalize={"none"} value={email} style={styles.input} onChangeText={this._onEmailChanged} />
                </View>
                <View style={{height: 50, marginTop: 20}}>
                    <TextInput autoCapitalize={"none"} secureTextEntry={true} value={password} style={styles.input} onChangeText={this._onPasswordChanged} />
                </View>
                <View style={{height: 50, marginTop: 20}}>
                  <Button
                    containerStyle={{justifyContent : "center", borderRadius : 5, backgroundColor : "white", height: 50, marginLeft: 50, marginRight : 50}}
                    style={{color : "#444"}}
                    onPress={this._onLoginButtonClicked}>
                    Login
                  </Button>
                </View>
              </View>
              {/*<ErrorMessage enableError={loginCompleted} showError={loginCompleted && loginHasError} />*/}
          </ImageBackground>
  }

  _onLoginButtonClicked = () => {
    let {email, password} = this.props.auth.loginForm;
    this.props.tryLogin(email, password);
  }

  _onEmailChanged = (newEmail) => {
    let {email, password} = this.props.auth.loginForm;
    this.props.updateLoginForm(newEmail, password);
  }

  _onPasswordChanged = (newPassword) => {
    let {email, password} = this.props.auth.loginForm;
    this.props.updateLoginForm(email, newPassword);
  }
}

function bindAction(dispatch) {
  return {
    tryAutoLogin : () => dispatch(tryAutoLogin()),
    tryLogin : (email, password) => dispatch(tryLogin(email, password)),
    updateLoginForm : (email, password) => dispatch(updateLoginForm(email, password))
  };
}

const mapStateToProps = state => ({
    auth : state.auth
});

export default connect(mapStateToProps, bindAction)(LoginScreen);
