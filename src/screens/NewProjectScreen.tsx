import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { MaterialId, OptimizationLevel, SimulationInput } from '../types';
import { COMPONENTS } from '../data/components';
import { MATERIALS } from '../data/materials';
import { LAUNCH_VEHICLES } from '../data/launchVehicles';
import { FormErrors, validateForm } from '../utils/validation';
import { formatUsd } from '../utils/format';
import { pickFromGallery, takePhoto, PickResult } from '../services/imagePicker';
import {
  Button,
  Card,
  Input,
  ScreenContainer,
  SectionTitle,
  SegmentedControl,
  SelectableRow,
} from '../components';
import { colors, fontSize, radius, spacing } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'NewProject'>;

const LEVEL_OPTIONS: { label: string; value: OptimizationLevel }[] = [
  { label: 'Conservador', value: 'conservador' },
  { label: 'Moderado', value: 'moderado' },
  { label: 'Agressivo', value: 'agressivo' },
];

export function NewProjectScreen() {
  const navigation = useNavigation<Nav>();

  const [projectName, setProjectName] = useState('');
  const [componentId, setComponentId] = useState(COMPONENTS[0].id);
  const [materialId, setMaterialId] = useState<MaterialId>(MATERIALS[0].id);
  const [level, setLevel] = useState<OptimizationLevel>('moderado');
  const [vehicleId, setVehicleId] = useState(LAUNCH_VEHICLES[0].id);
  const [quantityText, setQuantityText] = useState('1');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  function handlePickResult(result: PickResult) {
    if ('uri' in result) {
      setPhotoUri(result.uri);
      return;
    }
    if (result.error === 'permission') {
      Alert.alert(
        'Permissão negada',
        'Para anexar uma foto, autorize o acesso à câmera/galeria nas configurações do dispositivo.',
      );
    } else if (result.error === 'unknown') {
      Alert.alert('Ops', 'Não foi possível obter a imagem. Tente novamente.');
    }
    // 'cancelled' não precisa de aviso.
  }

  function onAddPhoto() {
    Alert.alert('Foto de referência', 'Como deseja adicionar a foto?', [
      { text: 'Tirar foto', onPress: async () => handlePickResult(await takePhoto()) },
      { text: 'Escolher da galeria', onPress: async () => handlePickResult(await pickFromGallery()) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  function onSubmit() {
    const nextErrors = validateForm({
      projectName,
      componentId,
      vehicleId,
      quantityText,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const input: SimulationInput = {
      projectName: projectName.trim(),
      componentId,
      materialId,
      level,
      vehicleId,
      quantity: Number(quantityText.trim()),
      photoUri,
    };
    navigation.navigate('Simulation', { input });
  }

  return (
    <ScreenContainer>
      <SectionTitle
        title="Dados do projeto"
        subtitle="Defina o componente e os parâmetros da otimização."
      />

      <Input
        label="Nome do projeto"
        value={projectName}
        onChangeText={setProjectName}
        placeholder="Ex.: Suporte da antena banda-X"
        error={errors.projectName}
        maxLength={40}
      />

      <SectionTitle title="Componente estrutural" />
      {COMPONENTS.map((c) => (
        <SelectableRow
          key={c.id}
          icon={c.icon}
          title={c.name}
          subtitle={c.description}
          selected={componentId === c.id}
          onPress={() => setComponentId(c.id)}
        />
      ))}

      <SectionTitle title="Material" />
      {MATERIALS.map((m) => (
        <SelectableRow
          key={m.id}
          title={m.name}
          subtitle={`${m.density.toString().replace('.', ',')} g/cm³ · ${m.description}`}
          selected={materialId === m.id}
          onPress={() => setMaterialId(m.id)}
        />
      ))}

      <SectionTitle title="Nível de otimização" />
      <SegmentedControl options={LEVEL_OPTIONS} value={level} onChange={setLevel} />

      <SectionTitle title="Veículo de lançamento" />
      {LAUNCH_VEHICLES.map((v) => (
        <SelectableRow
          key={v.id}
          title={v.name}
          subtitle={v.provider}
          trailing={`${formatUsd(v.costPerKg)}/kg`}
          selected={vehicleId === v.id}
          onPress={() => setVehicleId(v.id)}
        />
      ))}

      <SectionTitle title="Quantidade de unidades" subtitle="Ex.: tamanho da constelação." />
      <Input
        label="Unidades"
        value={quantityText}
        onChangeText={setQuantityText}
        placeholder="1"
        keyboardType="number-pad"
        error={errors.quantity}
        maxLength={6}
      />

      <SectionTitle title="Foto de referência" subtitle="Opcional — use a câmera ou a galeria." />
      {photoUri ? (
        <Card>
          <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
          <View style={styles.photoActions}>
            <Button label="Trocar" variant="secondary" style={styles.flex} onPress={onAddPhoto} />
            <Button
              label="Remover"
              variant="danger"
              style={styles.flex}
              onPress={() => setPhotoUri(null)}
            />
          </View>
        </Card>
      ) : (
        <Button label="Adicionar foto" variant="secondary" icon="📷" onPress={onAddPhoto} />
      )}

      <View style={styles.submit}>
        <Button label="Rodar simulação" icon="🚀" onPress={onSubmit} />
        <Text style={styles.hint}>
          A simulação estima a redução de massa e o custo de lançamento economizado.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: '100%',
    height: 200,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  photoActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex: {
    flex: 1,
  },
  submit: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  hint: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
});
