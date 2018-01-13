import React, { Component } from 'react';
import { View, TextInput, Text, FlatList, Image, Dimensions } from 'react-native';
import { FormLabel, FormInput } from 'react-native-elements';
import Button from "react-native-button";
import Modal from "react-native-modal";
import BaseScreen from "../BaseScreenRN";
import CommonHeader from "../../components/CommonHeader";
import InstaImage from "../../components/InstaImage";
import Configuration from "../../config/Configuration";
// redux
import { connect } from "react-redux";
import {  
  nameChanged, 
  currentJobChanged, 
  webSiteLinkChanged, 
  saveProfile,
  fetchProfile
} from "../../redux/auth/Actions";
import { 
  fetchMyRecentPhotos 
} from "../../redux/media/Actions";

const { width } = Dimensions.get('window');

const styles = {
  editProfileButton : {
    borderWidth: 0.5, 
    borderColor : "#ccc", 
    backgroundColor : "white", 
    color : "black", 
    justifyContent : "center", 
    alignItems : "center", 
    marginLeft: 5, 
    marginRight : 5, 
    paddingTop : 5, 
    paddingBottom: 5
  },
  saveProfileButton : {
    flex: 0.7,
    borderWidth: 0.5, 
    borderColor : "#ccc", 
    backgroundColor : "white",
    justifyContent : "center", 
    alignItems : "center", 
    marginLeft: 5, 
    marginRight : 5, 
    paddingTop : 5, 
    paddingBottom: 5
  },
  cancelProfileButton : {
    flex: 0.3,
    borderWidth: 0.5, 
    borderColor : "#ccc", 
    backgroundColor : "red",
    justifyContent : "center", 
    alignItems : "center", 
    marginLeft: 5, 
    marginRight : 5, 
    paddingTop : 5, 
    paddingBottom: 5    
  },
  /*
  // workshop redux Logout
  logoutButton : {
    marginTop: 10,
    borderWidth: 0.5, 
    borderColor : "#ccc", 
    backgroundColor : "red", 
    color : "white", 
    justifyContent : "center", 
    alignItems : "center", 
    marginLeft: 5, 
    marginRight : 5, 
    paddingTop : 5, 
    paddingBottom: 5    
  }
  */
}

class ProfileScreen extends BaseScreen {

  fetchInProgress = false;
  state = {
    isModalVisible : false
  }
  lastLoginTime = 0;

  constructor(props) {
    super(props);
  }

  componentWillMount(newProps) {
    this.props.fetchProfile();
    this.props.fetchMyRecentPhotos();
  }

  componentWillReceiveProps(nextProps) {
    let {loggedIn, user, lastLoginTime} = nextProps.auth;
  }

  render() {
    let {user, profile} = this.props.auth;
    let {myPhotos} = this.props.media;
    let myUser = user ? user : {};
    let userProfile = profile || {};

    return <View style={{flex: 1, backgroundColor : "white"}}>
        <CommonHeader />
        <View style={{height: 200}}>
          <View style={{flexDirection : "row", paddingTop: 10}}>
            <View style={{width: 120, alignItems : "center", justifyContent : "center"}}>
              <Image resizeMode={"stretch"} source={{uri : myUser.avatarUrl}} style={{width: 90, height: 90}} />
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection : "row", padding: 5, alignItems: "center", justifyContent : "center"}}>
                <Text style={{fontWeight : "bold", fontSize: 14}}>{myPhotos.length}</Text><Text style={{marginLeft: 5}}>Photos</Text>
              </View>
              <Button style={styles.editProfileButton} onPress={() => this.setState({isModalVisible : true})} >
                Edit Profile
              </Button>
              {/*
              <Button style={styles.logoutButton} onPress={this._doLogout} >
                Logout
              </Button>
              */}
            </View>
          </View>
          <View style={{padding: 10}}>
            <Text style={{fontWeight : "bold"}}>{userProfile.name}</Text>
            <Text>{userProfile.currentJob}</Text>
            <Text>{userProfile.webSite}</Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <FlatList
            style={{ flex: 1 }}
            data={myPhotos}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            numColumns={2}
            ListEmptyComponent={this._renderNoPhotoFound}
          />
        </View>
        {this._renderEditProfileModal()}
    </View>
  }

  _keyExtractor = (item, index) => item.key;

  _renderItem = ({ item }) => {
    return (<InstaImage source={item.source} width={width / 2} height={300} />);
  }

  _renderNoPhotoFound = () => {
    return <View style={{alignItems : "center", paddingTop : 150}}>
            <Text>No images found :(</Text>
          </View>
  } 
  
  _renderEditProfileModal = () => {
    let {user, profile} = this.props.auth;
    let userProfile = profile || {};

    return (<Modal isVisible={this.state.isModalVisible} style={{margin : 0}}>
      <View style={{ flex: 1, paddingTop : 20, backgroundColor : "#fff" }}>
          <View style={{flex: 1}}>
            <View>
              <FormLabel>Name</FormLabel>
              <FormInput placeholder="Enter Your Name" value={userProfile.name} onChangeText={this._onNameChanged} />
            </View>
            <View>
              <FormLabel>Current Job</FormLabel>
              <FormInput placeholder="Enter Your Current Job" value={userProfile.currentJob} onChangeText={this._onCurrentJobChanged} />            
            </View>
            <View>
              <FormLabel>Web Site</FormLabel>
              <FormInput autoCapitalize={"none"} placeholder="Enter Your Web Site" value={userProfile.webSite} onChangeText={this._onWebSiteLinkChanged} />            
            </View>  
          </View>
          <View style={{padding: 10, flexDirection : "row"}}>
            <Button containerStyle={styles.cancelProfileButton} style={{color : "white"}} onPress={() => this.setState({isModalVisible : false})} >
              Cancel
            </Button>
            <Button containerStyle={styles.saveProfileButton} style={{color : "black"}} onPress={this._onSaveProfileClicked} >
              Save
            </Button>
          </View>        
      </View>
    </Modal>)
  }

  _onNameChanged = (text) => {
    this.props.nameChanged(text);
  }

  _onCurrentJobChanged = (text) => {
    this.props.currentJobChanged(text);
  }

  _onWebSiteLinkChanged = (text) => {
    this.props.webSiteLinkChanged(text);
  }

  _onSaveProfileClicked = () => {
    let {user} = this.props.auth;
    this.props.saveProfile(user.profile);
    this.setState({isModalVisible : false})
  }

  _doLogout = () => {
    
  }
}

function bindAction(dispatch) {
  return {
    fetchMyRecentPhotos : () => dispatch(fetchMyRecentPhotos()),
    nameChanged : (nameText) => dispatch(nameChanged(nameText)),
    currentJobChanged : (jobText) => dispatch(currentJobChanged(jobText)),
    webSiteLinkChanged : (webSiteLinkText) => dispatch(webSiteLinkChanged(webSiteLinkText)),
    saveProfile : (profile) => dispatch(saveProfile(profile)),
    fetchProfile : () => dispatch(fetchProfile())
  };
}

const mapStateToProps = state => ({
    auth : state.auth,
    media : state.media
});

export default connect(mapStateToProps, bindAction)(ProfileScreen);
