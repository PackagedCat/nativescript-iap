/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("@nativescript/webpack");

module.exports = (env) => {
    webpack.init(env);
    webpack.useConfig("vue");

    return webpack.resolveConfig();
};
