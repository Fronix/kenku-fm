import { combineReducers, configureStore } from "@reduxjs/toolkit";
import bookmarksReducer from "../features/bookmarks/bookmarksSlice";
import connectionReducer from "../features/connection/connectionSlice";
import inputReducer from "../features/input/inputSlice";
import menuReducer from "../features/menu/menuSlice";
import outputReducer from "../features/output/outputSlice";
import playerReducer from "../features/player/playerSlice";
import settingsReducer from "../features/settings/settingsSlice";
import tabsReducer from "../features/tabs/tabsSlice";

import {
  createMigrate,
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  connection: connectionReducer,
  output: outputReducer,
  settings: settingsReducer,
  bookmarks: bookmarksReducer,
  tabs: tabsReducer,
  player: playerReducer,
  input: inputReducer,
  menu: menuReducer,
});

const migrations: any = {
  2: (state: RootState): RootState => {
    return {
      ...state,
      settings: {
        ...state.settings,
        urlBarEnabled: true,
        remoteEnabled: false,
        remoteAddress: "127.0.0.1",
        remotePort: "3333",
        externalInputsEnabled: false,
        multipleInputsEnabled: false,
        multipleOutputsEnabled: false,
      },
    };
  },
  // v1.1 - Add performance mode
  3: (state: RootState): RootState => {
    return {
      ...state,
      settings: {
        ...state.settings,
        streamingMode: "performance",
      },
    };
  },
};

const persistConfig = {
  key: "root",
  version: 4,
  storage,
  whitelist: ["bookmarks", "settings"],
  migrate: createMigrate(migrations, { debug: false }),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
