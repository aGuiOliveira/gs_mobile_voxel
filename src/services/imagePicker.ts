import * as ImagePicker from 'expo-image-picker';

/**
 * Recurso nativo: câmera e galeria (expo-image-picker).
 * Cada função trata a permissão negada e devolve a URI da imagem ou null.
 */

export type PickResult =
  | { uri: string }
  | { error: 'permission' }
  | { error: 'cancelled' }
  | { error: 'unknown' };

/** Tira uma foto usando a câmera do dispositivo. */
export async function takePhoto(): Promise<PickResult> {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return { error: 'permission' };

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.6,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (result.canceled) return { error: 'cancelled' };
    return { uri: result.assets[0].uri };
  } catch (error) {
    console.warn('Erro ao usar a câmera:', error);
    return { error: 'unknown' };
  }
}

/** Seleciona uma imagem da galeria do dispositivo. */
export async function pickFromGallery(): Promise<PickResult> {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return { error: 'permission' };

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.6,
      allowsEditing: true,
      aspect: [4, 3],
      mediaTypes: ['images'],
    });
    if (result.canceled) return { error: 'cancelled' };
    return { uri: result.assets[0].uri };
  } catch (error) {
    console.warn('Erro ao abrir a galeria:', error);
    return { error: 'unknown' };
  }
}
