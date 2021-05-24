const path = require("path");

module.exports = {
    outputDir: path.resolve(__dirname, "../build"),
    assetsDir: "../build",

    chainWebpack: config => {
        config.module.rules.delete('eslint');
    }
}