import { ScrollView, StyleSheet, Text, View, Switch, TextInput, TouchableOpacity, SafeAreaView, Image, Clipboard } from 'react-native'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import BouncyCheckbox from "react-native-bouncy-checkbox"
import img1 from './assets/images/img1.jpg'
import img2 from './assets/images/img2.jpg'
import solidIcon from './assets/images/copySolid.png'
import regularIcon from './assets/images/copyRegular.png'

const passwordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(4, "Do you want your password safe?")
    .max(16, "you can't even remember this")
    .required("what do I do with this?")
    .typeError('please enter a number')
})

export default function App() {
  const [password, setPassword] = useState('')
  const [isGenerated, setIsGenerated] = useState(false)
  const [Enabled, setEnabled] = useState(true);
  const toggleSwitch = () => setEnabled(!Enabled)
  const [ispressed,setPressed] = useState(false)
  const [include, setInclude] = useState({
    lowerCase: false,
    upperCase: false,
    number: false,
    symbol: false,
  })

  const backgroundImg = Enabled ? (img1) : (img2);

  const backgroundColor = Enabled?('rgba(0, 0, 0, 0.8)'):('rgba(195, 195, 195, 0.5)');

  const iconImg = Enabled?(regularIcon):(solidIcon);

  const copyToClipboard = () => {
    Clipboard.setString(password);
    setPressed(true);
    setTimeout(() => {
      setPressed(false)
    }, 1500);
  };

  const generatePassword = (passwordLength: number) => {
    let passwordString = '';

    const upperCaseChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChar = 'abcdefghijklmnopqrstuvwxyz';
    const digitChar = '0123456789';
    const specialChar = '!()@#$%^&*/?><';

    if (include.lowerCase) {
      passwordString += lowerCaseChar;
    }
    if (include.upperCase) {
      passwordString += upperCaseChar;
    }
    if (include.number) {
      passwordString += digitChar;
    }
    if (include.symbol) {
      passwordString += specialChar;
    }

    const resultPassword = createPassword(passwordString, passwordLength);
    setPassword(resultPassword);
    setIsGenerated(true);
  }

  const createPassword = (characters: string, passwordLength: number) => {
    let result = '';

    for (let i = 0; i < passwordLength; i++) {
      const randomNumber = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomNumber);
    }
    return result;
  }

  const resetPassword = () => {
    setInclude({
      lowerCase: false,
      upperCase: false,
      number: false,
      symbol: false,
    })
    setPassword('');
    setIsGenerated(false);
  }
  return (
    <>
      <SafeAreaView style={styles.safeAreaView}>
        <Image source={backgroundImg} style={styles.backgroundImage} />
        <ScrollView contentContainerStyle={styles.scrollViewContainer} scrollEnabled={false}>
          <View style={[styles.appContainer,{backgroundColor:backgroundColor},{}]}>
            <View>
              <View style={styles.topSection}>
                <Text style={styles.title}>Password Generator</Text>
                <View style={styles.topSectionRight}>
                  <Text style={styles.topSectionRightTxt}>Dark</Text>
                  <Switch
                    trackColor={{ false: '#767577', true: '#6f42c1' }}
                    thumbColor={Enabled ? '#ffffff' : '#ffffff'}
                    onValueChange={toggleSwitch}
                    value={Enabled}
                  />
                </View>
              </View>

              <Formik
                initialValues={{ passwordLength: '' }}
                validationSchema={passwordSchema}
                onSubmit={(values) => {
                  generatePassword(Number(values.passwordLength))
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleSubmit,
                  handleReset,
                }) => (
                  <>
                    <View style={styles.lengthInputContainer}>
                      <View>
                        <Text style={styles.lengthText}>Length</Text>
                        <>
                          {touched.passwordLength && errors.passwordLength && (
                            <Text style={styles.errorTxt}>
                              {errors.passwordLength}
                            </Text>
                          )}
                        </>
                      </View>
                      <TextInput
                        style={styles.lengthInput}
                        value={values.passwordLength}
                        placeholderTextColor={'#ffffff'}
                        onChangeText={handleChange('passwordLength')}
                        placeholder='Ex.8'
                        keyboardType='numeric'
                      />
                    </View>

                    <View style={styles.border}></View>
                    <View style={styles.inputContainer}>

                      <View style={styles.inputWrapper}>
                        <BouncyCheckbox
                          size={20}
                          isChecked={include.lowerCase}
                          fillColor='#6f42c1'
                          onPress={() => {
                            setInclude({ ...include, lowerCase: !include.lowerCase });
                          }}
                        />
                        <View style={styles.inputTxtBox}>
                          <Text style={styles.inputTxt}>Small Letters</Text>
                          <Text>(a-z)</Text>
                        </View>
                      </View>

                      <View style={styles.inputWrapper}>
                        <BouncyCheckbox
                          size={20}
                          isChecked={include.upperCase}
                          fillColor='#6f42c1'
                          onPress={() => {
                            setInclude({ ...include, upperCase: !include.upperCase });
                          }}
                        />
                        <View style={styles.inputTxtBox}>
                          <Text style={styles.inputTxt}>Capital Letters</Text>
                          <Text>(A-Z)</Text>
                        </View>
                      </View>

                      <View style={styles.inputWrapper}>
                        <BouncyCheckbox
                          size={20}
                          isChecked={include.number}
                          fillColor='#6f42c1'
                          onPress={() => {
                            setInclude({ ...include, number: !include.number });
                          }}
                        />
                        <View style={styles.inputTxtBox}>
                          <Text style={styles.inputTxt}>Numbers</Text>
                          <Text>(0-9)</Text>
                        </View>
                      </View>

                      <View style={styles.inputWrapper}>
                        <BouncyCheckbox
                          size={20}
                          isChecked={include.symbol}
                          fillColor='#6f42c1'
                          onPress={() => {
                            setInclude({ ...include, symbol: !include.symbol });
                          }}
                        />
                        <View style={styles.inputTxtBox}>
                          <Text style={styles.inputTxt}>Special Characters</Text>
                          <Text>(!()@#$%^&*/?)</Text>
                        </View>

                      </View>
                    </View>

                    <View style={styles.formAction}>
                      <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={() => { handleSubmit() }}
                      >
                        <Text style={styles.buttonTxt}>Generate</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.secondaryBtn}
                        onPress={() => {
                          handleReset()
                          resetPassword()
                        }}
                      >
                        <Text style={styles.buttonTxt}>Reset</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </View>
          {isGenerated && (
            <View style={[styles.resultContainer, { backgroundColor: backgroundColor }]}>
              <Text selectable style={[styles.result, { color: '#ffffff' }]}>{password}</Text>
              <TouchableOpacity onPress={copyToClipboard}>
                <Image style={styles.iconImg} source={iconImg}></Image>
              </TouchableOpacity>
            </View>
          )}

          {ispressed && (
            <View style={[styles.copyMsgContainer,{backgroundColor:backgroundColor}]}>
              <Text style={styles.copyMsg}>copied to clipboard</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  appContainer: {
    margin: 15,
    borderRadius: 15,
    padding: 30,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  title: {
    fontSize: 22,
    fontFamily: 'SourceCodePro-Bold',
    color:'#ffffff'
  },
  topSectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topSectionRightTxt: {
    fontSize: 18,
    fontWeight: '600',
    color:'#ffffff'
  },
  lengthInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  lengthInput: {
    borderRadius: 5,
    width: '30%',
    padding: 4,
    backgroundColor: 'rgba(52, 52, 52, 0.5)'
  },
  lengthText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#ffffff',
  },
  inputContainer: {
    gap: 5,
    marginBottom: 10
  },
  inputWrapper: {
    flexDirection: 'row',
  },
  inputTxtBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputTxt: {
    fontSize: 17,
    color: '#ffffff',
    fontWeight: '500',
    marginRight: 3
  },
  formAction: {
    gap: 10
  },
  primaryBtn: {
    padding: 10,
    backgroundColor: '#6f42c1',
    borderRadius: 6
  },
  secondaryBtn: {
    padding: 10,
    backgroundColor: '#6f42c1',
    borderRadius: 6
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: 16,
    color: '#ffffff'
  },
  resultContainer: {
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 15,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    gap:20
  },
  result: {
    textAlign: 'center',
    fontSize: 25
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
    zIndex: -1,
  },
  errorTxt:{
    color:'#ff3333',
    fontSize:13,
  },
  iconImg:{
    height:30
  },
  copyMsgContainer:{
    margin:15,
    padding:8,
    borderRadius:15,
  },
  copyMsg:{
    textAlign:'center',
    fontSize:20,
    color:'#ffffff',
  },
})
