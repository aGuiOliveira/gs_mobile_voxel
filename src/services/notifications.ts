import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

/**
 * Notificações locais — recurso nativo de mobile.
 * Avisa o usuário quando a simulação de otimização termina.
 * Tudo é envolvido em try/catch para nunca quebrar o fluxo principal:
 * em alguns ambientes (ex.: Expo Go) as notificações podem ter limitações.
 */

// Como a notificação aparece com o app aberto.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

let permissionGranted = false;

/** Solicita permissão de notificação (e cria o canal no Android). */
export async function ensureNotificationPermission(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Padrão',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const current = await Notifications.getPermissionsAsync();
    let status = current.status;
    if (status !== 'granted') {
      const request = await Notifications.requestPermissionsAsync();
      status = request.status;
    }
    permissionGranted = status === 'granted';
    return permissionGranted;
  } catch (error) {
    console.warn('Não foi possível configurar notificações:', error);
    return false;
  }
}

/** Dispara uma notificação local imediata. */
export async function notifyOptimizationComplete(
  title: string,
  body: string,
): Promise<void> {
  try {
    if (!permissionGranted) {
      const granted = await ensureNotificationPermission();
      if (!granted) return;
    }
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null, // imediata
    });
  } catch (error) {
    console.warn('Não foi possível enviar a notificação:', error);
  }
}
