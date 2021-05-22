const path = require("path");

module.exports = {
    outputDir: path.resolve(__dirname, "../build"),
    assetsDir: "../",

    chainWebpack: config => {
        config.module.rules.delete('eslint');
    }
}