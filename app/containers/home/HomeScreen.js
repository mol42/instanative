import React, { Component } from 'react'
import { View, Image, Text, StyleSheet, FlatList, TouchableOpacity, PermissionsAndroid } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InstaImage from '../../components/InstaImage';
import BaseScreen from "../BaseScreenRN";
import CommonHeader from "../../components/CommonHeader";
import { UploadMonitor } from "../../components/UploadMonitor";

// redux
import { connect } from "react-redux";
import { fetchRecentMedia } from "../../redux/media/Actions";

import Config from "../../config/Configuration";

class HomeScreen extends BaseScreen {

  static navigationOptions = { 
    header: null,
    tabBarVisible : true
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchRecentMedia();
    this._initializePermissions();
  }

  componentWillReceiveProps(nextProps) {
    let {activeUpload} = this.props.media;
    // bir upload işlemi bittiği zaman son yüklenen fotoyu
    // göstermek için sunucudan fotoları isteyen
    // aksiyonu tetikleriz.
    if (!activeUpload.running && activeUpload.completed) {
      this.props.fetchRecentMedia();
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <CommonHeader />
        {this._renderUploadProgress()}
        <FlatList
          style={{ flex: 1 }}
          data={this.props.media.mediaList}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ListEmptyComponent={this._renderNoPhotoFound}
        />
      </View>
    )
  }

  _keyExtractor = (item, index) => item.key;

  _renderItem = ({ item }) => {
    return (<View key={item.source} style={{borderBottomWidth: 0.5, borderBottomColor : "#ccc"}}>
              <View style={{ height: 60, backgroundColor: 'white', flexDirection: 'row' }}>
                <Image
                  style={{ width: 36, height: 36, margin: 12, borderRadius: 18, borderWidth: StyleSheet.hairlineWidth, borderColor: 'lightgray' }}
                  source={{ uri: this.props.auth.user.avatarUrl }}
                />
                <View style={{flex: 1, flexDirection : "row", alignItems : "center", justifyContent : "center"}}>
                  <TouchableOpacity style={{flex: 1, height : 60, justifyContent : "center"}} onPress={this._showLoginModal}>
                    <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                  </TouchableOpacity>
                  <Ionicons name="ios-more" size={30} color="black" style={{ marginRight: 15 }} />
                </View>
              </View>
              <InstaImage type={item.type} source={item.source} />
              <View style={{ height: 54, backgroundColor: 'white', flexDirection: 'row' }}>
                <Ionicons name="ios-heart-outline" size={34} color="black" style={{ marginTop: 12, marginLeft: 15 }} />
                <Ionicons name="ios-text-outline" size={34} color="black" style={{ marginTop: 12, marginLeft: 20 }} />
                <Ionicons name="ios-send-outline" size={34} color="black" style={{ marginTop: 12, marginLeft: 20 }} />
                <View style={{ flex: 1 }} />
                <Ionicons name="ios-bookmark-outline" size={34} color="black" style={{ marginTop: 12, marginRight: 15 }} />
              </View>
            </View>);
  }

  _renderNoPhotoFound = () => {
    return <View style={{alignItems : "center", paddingTop : 150}}>
            <Text>No images found :(</Text>
          </View>
  }

  _renderUploadProgress = () => {
    let {activeUpload} = this.props.media;
    if (!activeUpload.running) {
      return;
    }
    return <UploadMonitor progress={activeUpload.progress} />
  }

  _initializePermissions = async () => {
    if (Config.PLATFORM_ANDROID) {
      await this._askForCameraPermission();
      await this._askForDirectoryPermission();
    }
  }

  _askForCameraPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            'title': 'InstaNative',
            'message': 'InstaNative ile fotoğraf yüklemek için kamera erişimi gerekiyor'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the camera")
        } else {
          console.log("Camera permission denied")
        }
      } catch (err) {
        console.warn(err)
      }
  }

  _askForDirectoryPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          'title': 'InstaNative',
          'message': 'InstaNative ile fotoğraflarınızı saklamak için izin istiyor.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can save file")
      } else {
        console.log("File write permission denied")
      }
    } catch (err) {
      console.warn(err)
    }    
  }
}

function bindAction(dispatch) {
  return {
    fetchRecentMedia : () => dispatch(fetchRecentMedia())
  };
}

const mapStateToProps = state => ({
    media : state.media,
    auth : state.auth
});

export default connect(mapStateToProps, bindAction)(HomeScreen);
