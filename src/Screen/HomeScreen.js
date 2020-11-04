import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  Dimensions,
  Animated,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import {isTemplateLiteral} from '@babel/types';
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';
import {useSelector, useDispatch} from 'react-redux';
import {fetchData} from './../Redux/Action';

const rowTranslateAnimatedValues = {};

Array(100)
  .fill('')
  .forEach((_, i) => {
    rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
  });

const HomeScreen = props => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const initialData = useSelector(state => state.contactList);
  const dispatch = useDispatch();

  setTimeout(() => {
    setIsLoading(false);
  }, 1500);

  //the delete api seems a bit buggy
  const deleteContact = userId => {
    let urlString = `https://simple-contact-crud.herokuapp.com/contact/${userId}`;
    axios
      .delete(urlString)
      .then(res => {
        console.log(res);
        dispatch(fetchData());
        showToast('Contact Deleted');
      })
      .catch(err => {
        console.log(err);
        showToast('Failed To Delete Contact');
      });
  };

  const handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        setSelectedImage(response);
      }
    });
  };

  useEffect(() => {
    dispatch(fetchData());
  }, []);

  const onSwipeValueChange = swipeData => {
    const {key, value} = swipeData;
    let animationIsRunning = false;
    if (value < -Dimensions.get('window').width && !animationIsRunning) {
      animationIsRunning = true;
      Animated.timing(rowTranslateAnimatedValues[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(({finished}) => {
        const contactId = initialData.find(item => item.key === key).id;
        animationIsRunning = false;
        if (finished) {
          //this counter is needed because a bug
          //in Animated.timing (finished called twice or more)
          setCounter(counter + 1);
          if (counter == 1) {
            deleteContact(contactId);
          }
        }
      });
    }
  };

  const renderItem = data => (
    <Animated.View
      style={{
        height: rowTranslateAnimatedValues[data.item.key].interpolate({
          inputRange: [0, 1],
          outputRange: [0, 75],
        }),
      }}>
      <TouchableHighlight
        onPress={() =>
          props.navigation.navigate('ProfileScreen', {
            contactId: data.item.id,
          })
        }
        style={styles.rowFront}
        underlayColor={'#AAA'}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 20,
          }}>
          {data.item.photo !== 'N/A' ? (
            <Image style={styles.avatarImage} source={{uri: data.item.photo}} />
          ) : (
            <Image
              style={styles.avatarImage}
              source={require('./../../assets/profilePicture.png')}
            />
          )}
          <Text style={{fontSize: 16, fontWeight: '700'}}>
            {data.item.firstName} {data.item.lastName}
          </Text>
        </View>
      </TouchableHighlight>
    </Animated.View>
  );

  const renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}>Delete</Text>
      </View>
    </View>
  );

  const showToast = toastTitle => {
    ToastAndroid.showWithGravity(
      toastTitle,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          color="#F8B195"
          style={styles.loadingIndicator}
          size={'large'}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageHeaderText}>My Contact</Text>
      <View style={styles.greyLine} />
      <SwipeListView
        disableRightSwipe
        data={initialData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-Dimensions.get('window').width}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onSwipeValueChange={onSwipeValueChange}
        useNativeDriver={false}
      />

      <TouchableOpacity
        onPress={() => props.navigation.navigate('NewContactScreen')}
        style={styles.floatingActionButton}>
        <Icon name="add-outline" size={30} color={'#FFF'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  loadingIndicator: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9,
  },
  pageHeaderText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  greyLine: {
    width: '100%',
    borderBottomColor: '#d5d5d5',
    borderBottomWidth: 0.5,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    backgroundColor: '#FFFF',
    borderBottomColor: '#F8B195',
    borderBottomWidth: 0.5,
    height: 75,
    justifyContent: 'center',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#8A0303',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: '#8A0303',
    right: 0,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
    marginRight: 10,
  },
  floatingActionButton: {
    position: 'absolute',
    backgroundColor: '#F8B195',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    right: 30,
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'black',
    shadowOpacity: 1.0,
    elevation: 5,
  },
});

export default HomeScreen;
