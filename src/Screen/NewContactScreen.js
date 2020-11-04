import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {fetchData} from './../Redux/Action';

const NewContactScreen = props => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const initialData = useSelector(state => state.contactList);
  const dispatch = useDispatch();

  let firstNameTextInput = useRef(null);
  let lastNameTextInput = useRef(null);
  let ageTextInput = useRef(null);

  const createNewContact = () => {
    setIsLoading(true);
    if (firstName.trim() === '' && lastName.trim() === '' && age === 0) {
      Alert.alert('Please Fill The Form Properly');
    } else {
      if (selectedImage === null) {
        axios
          .post('https://simple-contact-crud.herokuapp.com/contact', {
            firstName: firstName,
            lastName: lastName,
            age: parseInt(age),
            photo: 'N/A',
          })
          .then(res => {
            dispatch(fetchData());
            setIsLoading(false);
            showToast('New Contact Created');
            props.navigation.goBack();
          })
          .catch(err => {
            console.log(err);
            setIsLoading(false);
            showToast('Failed, PLease Try Again');
          });
      } else {
        axios
          .post('https://simple-contact-crud.herokuapp.com/contact', {
            firstName: firstName,
            lastName: lastName,
            age: parseInt(age),
            photo: selectedImage.uri,
          })
          .then(res => {
            setIsLoading(false);
            showToast('New Contact Created');
            dispatch(fetchData());
          })
          .catch(err => {
            console.log(err);
            setIsLoading(false);
            showToast('Failed, PLease Try Again');
          });
      }
    }
  };

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

  return (
    <View style={StyleSheet.container}>
      {isLoading && (
        <ActivityIndicator
          color="#F8B195"
          style={styles.loading}
          size={'large'}
        />
      )}
      <Text style={styles.pageHeaderText}>New Contact</Text>
      <View style={styles.greyLine} />
      <View style={styles.avatarContainer}>
        {selectedImage !== null ? (
          <Image style={styles.avatarImage} source={{uri: selectedImage.uri}} />
        ) : (
          <Image
            style={styles.avatarImage}
            source={require('./../../assets/profilePicture.png')}
          />
        )}
        <TouchableOpacity
          onPress={handleChoosePhoto}
          style={styles.selectPhotoTouchable}>
          <Text style={styles.selectPhotoText}>Select Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.formRowContainer}>
          <Text style={styles.formText}>First Name</Text>
          <TextInput
            style={styles.formTextInput}
            ref={ref => {
              firstNameTextInput = ref;
            }}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              lastNameTextInput.focus();
            }}
            onChangeText={text => setFirstName(text)}
            placeholder="New Contact First name"
          />
        </View>

        <View style={styles.formRowContainer}>
          <Text style={styles.formText}>Last Name</Text>
          <TextInput
            style={styles.formTextInput}
            ref={ref => {
              lastNameTextInput = ref;
            }}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              ageTextInput.focus();
            }}
            onChangeText={text => setLastName(text)}
            placeholder="New Contact Last name"
          />
        </View>

        <View style={styles.formRowContainer}>
          <Text style={styles.formText}>Age</Text>
          <TextInput
            style={styles.formTextInput}
            ref={ref => {
              ageTextInput = ref;
            }}
            returnKeyType="done"
            onSubmitEditing={createNewContact}
            keyboardType={'number-pad'}
            placeholder="New Contact Age"
            onChangeText={text => setAge(text)}
          />
        </View>

        <TouchableOpacity
          onPress={createNewContact}
          style={styles.buttonTouchable}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
  },
  loading: {
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
  avatarContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
    alignItems: 'center',
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
  formContainer: {
    marginHorizontal: 20,
  },
  formRowContainer: {
    marginTop: 15,
  },
  formText: {
    color: '#D5D5D5',
    fontWeight: 'bold',
  },
  formTextInput: {
    borderBottomColor: '#D5D5D5',
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  buttonTouchable: {
    width: 120,
    height: 40,
    backgroundColor: '#F8B195',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 40,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'black',
  },
});

export default NewContactScreen;
