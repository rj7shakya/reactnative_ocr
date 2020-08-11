import React, {useState} from 'react';
import {StyleSheet, Text, View, Button, Image} from 'react-native';
import RNTextDetector from 'react-native-text-detector';

import IPicker from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';

const options = {
  title: 'Pick a image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const App = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState([]);

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
          setImage(img.path);
          const visionResp = await RNTextDetector.detectFromUri(img.path);
          setResult(visionResp);
        });
      }
    });
  };
  return (
    <View style={styles.container}>
      <Text>OCR TEST</Text>
      <Button title="Pick Image" onPress={() => chooseFile()} />
      {image && (
        <Image source={{uri: image ? image : null}} style={styles.image} />
      )}
      {result && result.map((res) => <Text key={res.text}>{res.text}</Text>)}
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
    width: 300,
    height: 50,
  },
});
