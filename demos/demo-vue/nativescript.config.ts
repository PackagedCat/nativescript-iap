import { NativeScriptConfig } from '@nativescript/core'

export default {
  id: 'com.nativescript.demo.inapppurchase',
  appPath: 'src',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  }
} as NativeScriptConfig
