var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

module.exports = function () {

    console.log('------------------------------------------------------------------------------------');

    if ( process.env.IONIC_ENV.toLowerCase() === 'prod' ) {
        useDefaultConfig[process.env.IONIC_ENV].resolve.alias = {
            "@environment": path.resolve(__dirname + '/environment.' + process.env.IONIC_ENV + '.ts'),
        };
        console.log('当前使用环境变量文件:'+__dirname + '/environment.' + process.env.IONIC_ENV + '.ts');
    } else {
        useDefaultConfig[process.env.IONIC_ENV].resolve.alias = {
            "@environment": path.resolve(__dirname + '/environment.ts'),
        };
        console.log('当前使用环境变量文件:'+__dirname + '/environment.ts');
    }

    console.log('------------------------------------------------------------------------------------');

    return useDefaultConfig;
};