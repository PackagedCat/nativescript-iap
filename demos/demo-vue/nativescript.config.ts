import { NativeScriptConfig } from "@nativescript/core";

export default {
    id: "com.nativescript.demo.inapppurchase",
    appPath: "app",
    appResourcesPath: "app_resources",
    android: {
        v8Flags: "--expose_gc",
        markingMode: "none"
    }
} as NativeScriptConfig;
