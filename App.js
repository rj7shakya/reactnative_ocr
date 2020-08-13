import React, {useState} from 'react';
import {StyleSheet, Text, View, Button, Image} from 'react-native';
import RNTextDetector from 'react-native-text-detector';

import IPicker from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import vision from '@react-native-firebase/ml-vision';

const options = {
  title: 'Pick a image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const App = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState();
  const [offlineres, setOfflineres] = useState();

  const chooseFile = async () => {
    ImagePicker.showImagePicker(options, async (response) => {
      if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.uri) {
        IPicker.openCropper({
          path: response.uri,
          width: 300,
          height: 50,
        }).then(async (img) => {
          setResult([]);
          setOfflineres([]);
          setImage(img.path);
          const visionResp = await RNTextDetector.detectFromUri(img.path);
          setResult(visionResp);

          const processed = await vision().textRecognizerProcessImage(img.path);
          setOfflineres(processed.text);
        });
      }
    });
  };
  return (
    <View style={styles.container}>
      <Text style={{marginVertical: 5}}>OCR TEST</Text>
      {image && (
        <Image source={{uri: image ? image : null}} style={styles.image} />
      )}
      <Button title="Pick Image" onPress={() => chooseFile()} />
      {result && (
        <View style={styles.result}>
          <Text style={styles.title}>text-detector result</Text>
          {result.map((res) => (
            <Text key={res.text}>{res.text}</Text>
          ))}
        </View>
      )}
      {offlineres && (
        <View style={styles.result}>
          <Text style={styles.title}>mlvision result</Text>
          <Text>{offlineres}</Text>
        </View>
      )}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    marginVertical: 5,
    width: 300,
    height: 50,
  },
  result: {
    padding: 8,
    borderWidth: 2,
    width: 300,
    margin: 10,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    marginBottom: 5,
  },
});
