import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';
import {useSelector, useDispatch} from 'react-redux';
import {fetchData} from './../Redux/Action';

const ProfileScreen = props => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [contactId, setContactId] = useState(props.route.params.contactId);
  const [contactDetails, setContactDetails] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newAge, setNewAge] = useState(0);
  const initialData = useSelector(state => state.contactList);
  const dispatch = useDispatch();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : -50;

  let firstNameTextInput = useRef(null);
  let lastNameTextInput = useRef(null);
  let ageTextInput = useRef(null);

  const handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.uri) {
        setSelectedImage(response);
      }
    });
  };

  const showToast = toastTitle => {
    ToastAndroid.showWithGravity(
      toastTitle,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  };

  useEffect(() => {
    const getContactById = () => {
      axios
        .get('https://simple-contact-crud.herokuapp.com/contact/' + contactId)
        .then(res => {
          setContactDetails(res.data.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
    };
    getContactById();
  }, []);

  const updateContact = () => {
    setIsUpdating(true);
    var payload = {};
    const contactId = contactDetails.id;
    if (selectedImage === null) {
      var payload = {
        firstName: newFirstName,
        lastName: newLastName,
        age: parseInt(newAge),
      };
    } else {
      var payload = {
        firstName: newFirstName,
        lastName: newLastName,
        age: parseInt(newAge),
        photo: selectedImage.uri,
      };
    }
    if (newFirstName.trim() == '') {
      delete payload['firstName'];
    }
    if (newLastName.trim() == '') {
      delete payload['lastName'];
    }
    if (parseInt(newAge) == 0) {
      delete payload['age'];
    }

    if (Object.keys(payload).length === 0) {
      setIsUpdating(false);
      setIsEditing(false);
      return showToast('No Data Was Updated');
    }

    axios
      .put(
        `https://simple-contact-crud.herokuapp.com/contact/${contactId}`,
        payload,
      )
      .then(res => {
        setIsUpdating(false);
        setContactDetails(res.data.data);
        setIsEditing(false);
        showToast('Update Profile Success');
        dispatch(fetchData());
      })
      .catch(err => {
        console.log(err);
        setIsUpdating(false);
        setIsEditing(false);
        showToast('Failed, PLease Try Again');
      });
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
    <ScrollView style={styles.container}>
      {isUpdating && (
        <ActivityIndicator
          color="#F8B195"
          style={styles.loadingIndicator}
          size={'large'}
        />
      )}
      <Text style={styles.pageHeaderText}>Profile</Text>
      <View style={styles.contentHeader}>
        <Image
          style={styles.avatarImage}
          source={
            contactDetails.photo !== 'N/A'
              ? {uri: contactDetails.photo}
              : require('./../../assets/profilePicture.png')
          }
        />
        {isEditing ? (
          <TouchableOpacity
            onPress={handleChoosePhoto}
            style={styles.selectPhotoTouchable}>
            <Text style={styles.selectPhotoText}>Select Photo</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.nameText}>
              {contactDetails.firstName} {contactDetails.lastName}
            </Text>
            <Text style={styles.ageText}>{contactDetails.age} years old</Text>
          </>
        )}
      </View>
      <View style={styles.formContainer}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.nameFormContainer}>
            <Text style={styles.formTitleText}>First Name</Text>
            {isEditing ? (
              <TextInput
                ref={ref => {
                  firstNameTextInput = ref;
                }}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  lastNameTextInput.focus();
                }}
                onChangeText={text => setNewFirstName(text)}
                placeholder={contactDetails.firstName}
              />
            ) : (
              <Text style={styles.formDataText}>
                {contactDetails.firstName}
              </Text>
            )}
          </View>
          <View style={styles.nameFormContainer}>
            <Text style={styles.formTitleText}>Last Name</Text>
            {isEditing ? (
              <TextInput
                ref={ref => {
                  lastNameTextInput = ref;
                }}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  ageTextInput.focus();
                }}
                onChangeText={text => setNewLastName(text)}
                placeholder={contactDetails.lastName}
              />
            ) : (
              <Text style={styles.formDataText}>{contactDetails.lastName}</Text>
            )}
          </View>
        </View>

        <View style={{marginTop: 15}}>
          <Text style={styles.formTitleText}>Age</Text>
          {isEditing ? (
            <TextInput
              style={styles.textInput}
              ref={ref => {
                ageTextInput = ref;
              }}
              returnKeyType="done"
              blurOnSubmit={false}
              onSubmitEditing={updateContact}
              keyboardType={'number-pad'}
              onChangeText={text => setNewAge(text)}
              placeholder="Enter Age"
            />
          ) : (
            <Text
              style={{
                borderBottomColor: '#D5D5D5',
                borderBottomWidth: 1,
                paddingVertical: 10,
                paddingLeft: 5,
              }}>
              {contactDetails.age} years
            </Text>
          )}
        </View>

        <View style={{marginTop: 15}}>
          <Text style={styles.formTitleText}>Email</Text>
          <Text
            style={{
              borderBottomColor: '#D5D5D5',
              borderBottomWidth: 1,
              paddingVertical: 5,
            }}>
            -
          </Text>
        </View>

        <View style={{marginTop: 15}}>
          <Text style={styles.formTitleText}>Date Of Birth</Text>
          <Text
            style={{
              borderBottomColor: '#D5D5D5',
              borderBottomWidth: 1,
              paddingVertical: 5,
            }}>
            -
          </Text>
        </View>

        <View style={{marginTop: 15}}>
          <Text style={styles.formTitleText}>Address</Text>
          <Text
            style={{
              borderBottomColor: '#D5D5D5',
              borderBottomWidth: 1,
              paddingVertical: 5,
            }}>
            -
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <TouchableOpacity
              onPress={updateContact}
              style={styles.buttonTouchable}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={styles.buttonTouchable}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={{height: 100}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9,
  },
  pageHeaderText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  contentHeader: {
    alignItems: 'center',
    marginBottom: 10,
    height: '30%',
    backgroundColor: '#F3F3F3',
    paddingTop: 20,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    resizeMode: 'cover',
  },
  selectPhotoTouchable: {
    alignItems: 'center',
    marginTop: 20,
  },
  selectPhotoText: {
    color: '#5FC9F8',
    fontSize: 16,
  },
  nameText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  ageText: {
    marginTop: 5,
    fontWeight: 'bold',
    color: 'grey',
  },
  formContainer: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  nameFormContainer: {
    width: '45%',
    borderBottomColor: '#D5D5D5',
    borderBottomWidth: 1,
  },
  formTitleText: {
    color: '#D5D5D5',
    fontWeight: 'bold',
  },
  formDataText: {
    paddingVertical: 14,
    paddingLeft: 5,
  },
  textInput: {
    borderBottomColor: '#D5D5D5',
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  buttonContainer: {
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonTouchable: {
    width: 120,
    height: 40,
    backgroundColor: '#F8B195',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'black',
  },
});

export default ProfileScreen;
