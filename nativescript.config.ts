import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.shrtr',
  appPath: 'app',
  appResourcesPath: '../../tools/assets/App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  },
  ios: {
    discardUncaughtJsExceptions: true,
    SPMPackages: []
  }
} as NativeScriptConfig;