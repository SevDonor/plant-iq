import { child, get, onValue, push, ref, remove, set, update } from 'firebase/database';
import { mockSnapshot } from '../data/mockData';
import { database, hasFirebaseConfig } from './firebaseClient';

const DEVICE_ID = 'esp32_prototype_01';
const PLANT_ID = 'plant-001';

let mockState = structuredClone(mockSnapshot);

const clone = (value) => structuredClone(value);

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const requireDatabase = () => hasFirebaseConfig && database;

const toTimestamp = (value) => {
  if (!value) return Date.now();
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? Date.now() : timestamp;
};

// Maps RTDB ESP32 environment to app currentSensor
const mapSensorFromESP32 = (envData) => {
  if (!envData) return mockSnapshot.currentSensor;

  return {
    temperature: envData.temperature ?? 0,
    airHumidity: envData.humidity ?? 0,
    soilMoisture: envData.soil_moisture ?? 0,
    light: envData.light ?? 0,
    airQuality: envData.gas_level ?? 0,
    timestamp: Date.now(), // Realtime DB doesn't have an explicit timestamp in the ESP32 data provided
  };
};

const mapDeviceFromESP32 = (hwData) => {
  if (!hwData) return mockSnapshot.device;

  return {
    ...mockSnapshot.device,
    id: DEVICE_ID,
    pump: Boolean(hwData.pump_status),
    lastSeen: Date.now(), // Since it's realtime, we consider it seen now
    battery: hwData.battery_voltage ?? 0,
    mpu6050: hwData.mpu6050 || { accel_x: 0, accel_y: 0, accel_z: 0 },
  };
};

// Keep existing mapping functions for plants and reminders
const mapPlantFromData = (id, data) => {
  if (!data) return mockSnapshot.plant;
  return {
    ...mockSnapshot.plant,
    ...data,
    id: id || data.id,
  };
};

const mapReminderFromData = (id, data) => ({
  ...data,
  id: id || data.id,
  enabled: data.enabled ?? true,
  completed: data.completed ?? false,
});

const buildSnapshotFromFirebase = async () => {
  const dbRef = ref(database);
  
  const [
    plantSnapshot,
    plantsSnapshot,
    esp32EnvSnapshot,
    esp32HwSnapshot,
    remindersSnapshot
  ] = await Promise.all([
    get(child(dbRef, `plants/${PLANT_ID}`)),
    get(child(dbRef, 'plants')),
    get(child(dbRef, `${DEVICE_ID}/environment`)),
    get(child(dbRef, `${DEVICE_ID}/hardware`)),
    get(child(dbRef, 'reminders'))
  ]);

  const plantData = plantSnapshot.val();
  const plant = plantData ? mapPlantFromData(PLANT_ID, plantData) : mockSnapshot.plant;

  const plantsData = plantsSnapshot.val() || {};
  const plants = Object.keys(plantsData).length
    ? Object.keys(plantsData).map(key => mapPlantFromData(key, plantsData[key]))
    : [plant];

  const currentSensor = mapSensorFromESP32(esp32EnvSnapshot.val());
  const device = mapDeviceFromESP32(esp32HwSnapshot.val());

  const remindersData = remindersSnapshot.val() || {};
  const reminders = Object.keys(remindersData)
    .map(key => mapReminderFromData(key, remindersData[key]))
    .filter(r => r.plantId === PLANT_ID);

  return {
    ...mockSnapshot,
    mode: 'firebase',
    plant,
    plants,
    currentSensor,
    sensorHistory: mockSnapshot.sensorHistory, // Not implemented in RTDB schema yet
    reminders,
    device,
  };
};

export const derivePlantAlerts = (sensor, thresholds) => {
  const alerts = [];

  if (!sensor || !thresholds) {
    return [{ id: 'missing-data', title: 'Chưa có dữ liệu cảm biến', level: 'warning' }];
  }

  if (sensor.soilMoisture < thresholds.soilMoistureMin) {
    alerts.push({ id: 'soil-low', title: 'Cần tưới nước', level: 'warning' });
  }

  if (sensor.temperature > thresholds.tempMax) {
    alerts.push({ id: 'temp-high', title: 'Nhiệt độ cao', level: 'danger' });
  }

  if (sensor.light < thresholds.lightMin) {
    alerts.push({ id: 'light-low', title: 'Thiếu ánh sáng', level: 'warning' });
  }

  if (alerts.length === 0) {
    alerts.push({ id: 'plant-good', title: 'Cây đang phát triển tốt', level: 'good' });
  }

  return alerts;
};

export const subscribeSensorData = (callback, onError) => {
  if (!requireDatabase()) {
    callback(clone(mockState));
    return () => {};
  }

  let active = true;
  
  // Initial fetch
  buildSnapshotFromFirebase()
    .then(snapshot => {
      if (active) callback(snapshot);
    })
    .catch(err => onError?.(err));

  // Listen for realtime updates from ESP32
  const envRef = ref(database, `${DEVICE_ID}/environment`);
  const hwRef = ref(database, `${DEVICE_ID}/hardware`);

  const unsubscribeEnv = onValue(envRef, (snapshot) => {
    if (!active) return;
    const envData = snapshot.val();
    callback((prevState) => ({
      ...prevState,
      currentSensor: mapSensorFromESP32(envData)
    }));
  }, (error) => {
    onError?.(error);
  });

  const unsubscribeHw = onValue(hwRef, (snapshot) => {
    if (!active) return;
    const hwData = snapshot.val();
    callback((prevState) => ({
      ...prevState,
      device: mapDeviceFromESP32(hwData)
    }));
  }, (error) => {
    onError?.(error);
  });

  return () => {
    active = false;
    unsubscribeEnv();
    unsubscribeHw();
  };
};

export const updatePumpState = async (isOn) => {
  if (!requireDatabase()) {
    mockState = {
      ...mockState,
      device: { ...mockState.device, pump: isOn },
      activity: [
        {
          id: `act-${Date.now()}`,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          title: isOn ? 'Đang tưới nước thủ công' : 'Đã tắt bơm nước',
          level: isOn ? 'warning' : 'good',
        },
        ...mockState.activity,
      ],
    };
    return clone(mockState.device);
  }

  const pumpRef = ref(database, `${DEVICE_ID}/hardware/pump_status`);
  await set(pumpRef, isOn);
  return { pump: isOn };
};

export const updatePlantSettings = async (settings) => {
  if (!requireDatabase()) {
    mockState = {
      ...mockState,
      plant: { ...mockState.plant, ...settings },
      plants: mockState.plants.map((plant) =>
        plant.id === PLANT_ID ? { ...plant, ...settings } : plant,
      ),
    };
    return clone(mockState.plant);
  }

  const plantRef = ref(database, `plants/${PLANT_ID}`);
  await update(plantRef, settings);
  
  const snapshot = await get(plantRef);
  return mapPlantFromData(PLANT_ID, snapshot.val());
};

export const createPlant = async (plant) => {
  if (!requireDatabase()) {
    mockState = {
      ...mockState,
      plants: [plant, ...mockState.plants],
    };
    return clone(plant);
  }

  const newPlantRef = push(ref(database, 'plants'));
  const newPlantId = newPlantRef.key;
  const newPlant = { ...plant, id: newPlantId };
  await set(newPlantRef, newPlant);
  
  return newPlant;
};

export const updatePlantProfile = async (id, patch) => {
  if (!requireDatabase()) {
    mockState = {
      ...mockState,
      plant: mockState.plant.id === id ? { ...mockState.plant, ...patch } : mockState.plant,
      plants: mockState.plants.map((plant) =>
        plant.id === id ? { ...plant, ...patch } : plant,
      ),
    };
    return clone(mockState.plants.find((plant) => plant.id === id) || mockState.plant);
  }

  const plantRef = ref(database, `plants/${id}`);
  await update(plantRef, patch);
  
  const snapshot = await get(plantRef);
  return mapPlantFromData(id, snapshot.val());
};

export const deletePlantProfile = async (id) => {
  if (!requireDatabase()) {
    const plants = mockState.plants.filter((plant) => plant.id !== id);
    mockState = {
      ...mockState,
      plants,
      plant: mockState.plant.id === id ? plants[0] || mockSnapshot.plant : mockState.plant,
    };
    return true;
  }

  await remove(ref(database, `plants/${id}`));
  return true;
};

export const createReminder = async (reminder) => {
  const payload = {
    ...reminder,
    plantId: PLANT_ID,
    enabled: reminder.enabled ?? true,
    completed: false,
  };

  if (!requireDatabase()) {
    const created = { id: `reminder-${Date.now()}`, ...payload };
    mockState = { ...mockState, reminders: [created, ...mockState.reminders] };
    return clone(created);
  }

  const newReminderRef = push(ref(database, 'reminders'));
  const newId = newReminderRef.key;
  const newReminder = { ...payload, id: newId };
  await set(newReminderRef, newReminder);
  
  return newReminder;
};

export const updateReminder = async (id, data) => {
  if (!requireDatabase()) {
    mockState = {
      ...mockState,
      reminders: mockState.reminders.map((reminder) =>
        reminder.id === id ? { ...reminder, ...data } : reminder,
      ),
    };
    return clone(mockState.reminders.find((reminder) => reminder.id === id));
  }

  const reminderRef = ref(database, `reminders/${id}`);
  await update(reminderRef, data);
  
  const snapshot = await get(reminderRef);
  return mapReminderFromData(id, snapshot.val());
};

export const deleteReminder = async (id) => {
  if (!requireDatabase()) {
    mockState = {
      ...mockState,
      reminders: mockState.reminders.filter((reminder) => reminder.id !== id),
    };
    return true;
  }

  await remove(ref(database, `reminders/${id}`));
  return true;
};
