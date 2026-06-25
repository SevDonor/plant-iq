import { useCallback, useEffect, useMemo, useState } from 'react';
import BottomNav from './components/BottomNav';
import NotificationPanel from './components/NotificationPanel';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { mockSnapshot } from './data/mockData';
import { fetchCurrentWeather } from './services/weatherService';
import {
  getCurrentUser,
  signIn,
  signInWithProvider,
  signOut,
  signUp,
  subscribeAuthState,
} from './firebase/authService';
import {
  createPlant,
  createReminder,
  derivePlantAlerts,
  deletePlantProfile,
  deleteReminder,
  subscribeSensorData,
  updatePlantSettings,
  updatePlantProfile,
  updatePumpState,
  updateReminder,
} from './firebase/plantService';
import Alerts from './pages/Alerts';
import AuthPage from './pages/AuthPage';
import Care from './pages/Care';
import Dashboard from './pages/Dashboard';
import PlantDetail from './pages/PlantDetail';
import PlantList from './pages/PlantList';
import Settings from './pages/Settings';
import Statistics from './pages/Statistics';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedPlantId, setSelectedPlantId] = useState(mockSnapshot.plant.id);
  const [data, setData] = useState(mockSnapshot);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [pumpBusy, setPumpBusy] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((user) => {
        if (active) setAuthUser(user);
      })
      .catch((authLoadError) => {
        if (active) setAuthError(authLoadError.message || 'Không tải được phiên đăng nhập.');
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });

    const unsubscribe = subscribeAuthState((user) => {
      setAuthUser(user);
      setAuthLoading(false);
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    const unsubscribe = subscribeSensorData(
      (snapshot) => {
        setData(snapshot);
        setLoading(false);
        setRefreshing(false);
      },
      (supabaseError) => {
        setError(supabaseError);
        setLoading(false);
        setRefreshing(false);
      },
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!authUser) return undefined;
    const unsubscribe = loadData();
    
    // Fetch weather data
    fetchCurrentWeather().then(weather => {
      setData(current => ({ ...current, weather }));
    });

    return () => unsubscribe?.();
  }, [authUser, loadData]);

  const handleSignIn = async (credentials) => {
    setAuthBusy(true);
    setAuthError('');
    try {
      const user = await signIn(credentials);
      setAuthUser(user);
    } catch (signInError) {
      setAuthError(signInError.message || 'Đăng nhập thất bại.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignUp = async (credentials) => {
    setAuthBusy(true);
    setAuthError('');
    try {
      const user = await signUp(credentials);
      setAuthUser(user);
    } catch (signUpError) {
      setAuthError(signUpError.message || 'Đăng ký thất bại.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleProviderSignIn = async (provider) => {
    setAuthBusy(true);
    setAuthError('');
    try {
      await signInWithProvider(provider);
    } catch (providerError) {
      setAuthError(providerError.message || 'Đăng nhập OAuth thất bại.');
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    setAuthBusy(true);
    setAuthError('');
    try {
      await signOut();
      setAuthUser(null);
      setActivePage('dashboard');
      setNotificationsOpen(false);
    } catch (signOutError) {
      setAuthError(signOutError.message || 'Đăng xuất thất bại.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const weather = await fetchCurrentWeather();
      setData((current) => ({ 
        ...current, 
        weather,
        currentSensor: { ...current.currentSensor, timestamp: Date.now() } 
      }));
    } finally {
      setRefreshing(false);
    }
  };

  const navigateToPlantDetail = (plantId) => {
    setSelectedPlantId(plantId);
    setActivePage('detail');
  };

  const handlePumpToggle = async (isOn) => {
    setPumpBusy(true);
    try {
      await updatePumpState(isOn);
      setData((current) => ({
        ...current,
        device: { ...current.device, pump: isOn, lastSeen: Date.now() },
        activity: [
          {
            id: `act-${Date.now()}`,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            title: isOn ? 'Đang tưới nước thủ công' : 'Đã tắt bơm nước',
            level: isOn ? 'warning' : 'good',
          },
          ...current.activity,
        ],
      }));
    } finally {
      setPumpBusy(false);
    }
  };

  const handleCreateReminder = async (reminder) => {
    setActionBusy(true);
    try {
      const created = await createReminder(reminder);
      setData((current) => ({ ...current, reminders: [created, ...current.reminders] }));
    } finally {
      setActionBusy(false);
    }
  };

  const handleUpdateReminder = async (id, patch) => {
    setActionBusy(true);
    try {
      await updateReminder(id, patch);
      setData((current) => ({
        ...current,
        reminders: current.reminders.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      }));
    } finally {
      setActionBusy(false);
    }
  };

  const handleDeleteReminder = async (id) => {
    setActionBusy(true);
    try {
      await deleteReminder(id);
      setData((current) => ({
        ...current,
        reminders: current.reminders.filter((item) => item.id !== id),
      }));
    } finally {
      setActionBusy(false);
    }
  };

  const handleSaveSettings = async (settings) => {
    setActionBusy(true);
    try {
      await updatePlantSettings(settings);
      setData((current) => ({
        ...current,
        plant: { ...current.plant, ...settings },
        plants: current.plants.map((plant) =>
          plant.id === current.plant.id ? { ...plant, ...settings } : plant,
        ),
      }));
    } finally {
      setActionBusy(false);
    }
  };

  const handleAddPlant = async (plantForm) => {
    setActionBusy(true);
    try {
      const id = `plant-${Date.now()}`;
      const plantPayload = {
        id,
        name: plantForm.name,
        scientificName: plantForm.scientificName,
        species: plantForm.species,
        plantedDate: new Date().toLocaleDateString('vi-VN'),
        ageMonth: 0,
        stage: 'Mới thêm',
        status: 'good',
        statusText: 'Tốt',
        deviceId: data.device.id,
        soilMoisture: data.currentSensor.soilMoisture,
        temperature: data.currentSensor.temperature,
        light: data.currentSensor.light,
        thresholds: {
          soilMoistureMin: 55,
          soilMoistureMax: 80,
          tempMin: 18,
          tempMax: 30,
          airHumidityMin: 60,
          airHumidityMax: 80,
          lightMin: 500,
          lightMax: 1500,
        },
      };
      const createdPlant = await createPlant(plantPayload);

      setData((current) => ({
        ...current,
        plants: [createdPlant, ...current.plants],
        activity: [
          {
            id: `act-${Date.now()}`,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            title: `Đã thêm ${createdPlant.name} vào vườn`,
            level: 'good',
          },
          ...current.activity,
        ],
      }));
      setSelectedPlantId(createdPlant.id);
    } finally {
      setActionBusy(false);
    }
  };

  const handleUpdatePlant = async (plantId, plantForm) => {
    setActionBusy(true);
    try {
      const updatedPlant = await updatePlantProfile(plantId, plantForm);
      setData((current) => ({
        ...current,
        plant: current.plant.id === plantId ? { ...current.plant, ...updatedPlant } : current.plant,
        plants: current.plants.map((plant) =>
          plant.id === plantId ? { ...plant, ...updatedPlant } : plant,
        ),
        activity: [
          {
            id: `act-${Date.now()}`,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            title: `Đã cập nhật hồ sơ ${updatedPlant.name}`,
            level: 'good',
          },
          ...current.activity,
        ],
      }));
    } finally {
      setActionBusy(false);
    }
  };

  const handleDeletePlant = async (plantId) => {
    setActionBusy(true);
    try {
      await deletePlantProfile(plantId);
      setData((current) => {
        const deletedPlant = current.plants.find((plant) => plant.id === plantId);
        const remainingPlants = current.plants.filter((plant) => plant.id !== plantId);
        const nextPrimaryPlant = current.plant.id === plantId
          ? remainingPlants[0] || mockSnapshot.plant
          : current.plant;

        return {
          ...current,
          plant: nextPrimaryPlant,
          plants: remainingPlants,
          activity: [
            {
              id: `act-${Date.now()}`,
              time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              title: deletedPlant ? `Đã xóa ${deletedPlant.name} khỏi danh sách cây` : 'Đã xóa hồ sơ cây',
              level: 'warning',
            },
            ...current.activity,
          ],
        };
      });
      setSelectedPlantId((currentId) => {
        if (currentId !== plantId) return currentId;
        const nextPlant = data.plants.find((plant) => plant.id !== plantId);
        return nextPlant?.id || mockSnapshot.plant.id;
      });
      if (activePage === 'detail') setActivePage('plants');
    } finally {
      setActionBusy(false);
    }
  };

  const selectedPlant = useMemo(
    () => data.plants.find((plant) => plant.id === selectedPlantId) || data.plant,
    [data.plant, data.plants, selectedPlantId],
  );

  const currentAlerts = useMemo(
    () => derivePlantAlerts(data.currentSensor, selectedPlant?.thresholds || data.plant?.thresholds),
    [data.currentSensor, data.plant?.thresholds, selectedPlant?.thresholds],
  );

  const page = useMemo(() => {
    const props = { data, loading, error, onNavigate: setActivePage };
    const pages = {
      dashboard: <Dashboard {...props} />,
      plants: (
        <PlantList
          plants={data.plants}
          onDetail={navigateToPlantDetail}
          onAddPlant={handleAddPlant}
          onUpdatePlant={handleUpdatePlant}
          onDeletePlant={handleDeletePlant}
          actionBusy={actionBusy}
        />
      ),
      detail: (
        <PlantDetail
          data={data}
          plant={selectedPlant}
          onPumpToggle={handlePumpToggle}
          pumpBusy={pumpBusy}
          onSavePlant={handleUpdatePlant}
          actionBusy={actionBusy}
        />
      ),
      care: (
        <Care
          reminders={data.reminders}
          onCreateReminder={handleCreateReminder}
          onUpdateReminder={handleUpdateReminder}
          onDeleteReminder={handleDeleteReminder}
          actionBusy={actionBusy}
        />
      ),
      alerts: (
        <Alerts
          data={data}
          alerts={currentAlerts}
          onNavigate={setActivePage}
          onPumpToggle={handlePumpToggle}
          pumpBusy={pumpBusy}
        />
      ),
      statistics: <Statistics history={data.sensorHistory} reminders={data.reminders} />,
      settings: (
        <Settings
          data={data}
          onSaveSettings={handleSaveSettings}
          onPumpToggle={handlePumpToggle}
          actionBusy={actionBusy}
          pumpBusy={pumpBusy}
        />
      ),
    };
    return pages[activePage] ?? pages.dashboard;
  }, [activePage, actionBusy, data, error, loading, pumpBusy, selectedPlant]);

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-card border border-emerald-100 bg-white/88 px-6 py-5 text-center shadow-card">
          <p className="text-lg font-black text-slate-950">Đang kiểm tra phiên đăng nhập...</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">Plant-IQ</p>
        </div>
      </main>
    );
  }

  if (!authUser) {
    return (
      <AuthPage
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onProviderSignIn={handleProviderSignIn}
        busy={authBusy}
        error={authError}
      />
    );
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        user={authUser}
        onSignOut={handleSignOut}
        alertCount={currentAlerts.filter((alert) => alert.level !== 'good').length}
      />
      <main className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-8 xl:pb-10 2xl:px-10 3xl:px-12">
        <div className="mx-auto w-full max-w-[1680px] 3xl:max-w-[1840px] 4xl:max-w-[1960px]">
          <div className="relative z-30">
            <Topbar
              weather={data.weather}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              notificationsOpen={notificationsOpen}
              onToggleNotifications={() => setNotificationsOpen((open) => !open)}
              user={authUser}
              onSignOut={handleSignOut}
            />
            {notificationsOpen ? (
              <NotificationPanel
                alerts={currentAlerts}
                activity={data.activity}
                onClose={() => setNotificationsOpen(false)}
              />
            ) : null}
          </div>
          {page}
        </div>
      </main>
      <BottomNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
}

export default App;
