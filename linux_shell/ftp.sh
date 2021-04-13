#! /bin/bash

HOST=118.25.74.169:10167
PASS=Dandian=6
USER=tulin-hotfix

param1=$1

#上传android目录
function uploadAndroid() {
    echo "连接 com_trendzone_tulinerp ftp服务器..."
    lftp -u ${USER},${PASS} sftp://${HOST} <<EOF
echo "更新 com_trendzone_tulinerp android 热更新文件..."
cd /var/www/Tulin-Hotfix/com_trendzone_tulinerp
echo "删除 android 热更新文件..."
rm -r android/
echo "上传 android 热更新文件..."
mirror -R ./dist/com_trendzone_tulinerp/prod/android /var/www/Tulin-Hotfix/com_trendzone_tulinerp/android
bye
EOF
    echo "tulinerp android 热更新发布完成"
}

#上传ios目录
function uploadIos() {
    echo "连接 com_trendzone_tulinerp ftp服务器..."
    lftp -u ${USER},${PASS} sftp://${HOST} <<EOF
echo "更新 com_trendzone_tulinerp ios 热更新文件..."
cd /var/www/Tulin-Hotfix/com_trendzone_tulinerp
echo "删除 ios 热更新文件..."
rm -r ios/
echo "上传 ios 热更新文件..."
mirror -R ./dist/com_trendzone_tulinerp/prod/ios /var/www/Tulin-Hotfix/com_trendzone_tulinerp/ios
bye
EOF
    echo "tulinerp ios 热更新发布完成"
}

#上传browser目录
function uploadBrowser() {
    echo "连接 com_trendzone_tulinerp ftp服务器..."
    lftp -u ${USER},${PASS} sftp://${HOST} <<EOF
echo "更新 com_trendzone_tulinerp browser 文件..."
cd /var/www/Tulin-Hotfix/com_trendzone_tulinerp
echo "删除 browser 文件..."
rm -r browser/
echo "上传 browser 文件..."
mirror -R ./dist/com_trendzone_tulinerp/prod/browser /var/www/Tulin-Hotfix/com_trendzone_tulinerp/browser

echo "更新浏览器内容..."
cd /var/www/Cloud_CFS/QBWEB/Mapp/Yun_Production

echo "删除mapp目录..."
mirror -Re ./none /var/www/Cloud_CFS/QBWEB/Mapp/Yun_Production

echo "上传文件..."
mirror -R ./dist/com_trendzone_tulinerp/prod/browser /var/www/Cloud_CFS/QBWEB/Mapp/Yun_Production
bye
EOF
    echo "tulinerp browser 发布完成"
}

#选择上传到那个目录
function changeUpload() {
    if [ $param1 == "android" ]; then
        uploadAndroid
    elif [ $param1 == "ios" ]; then
        uploadIos
    elif [ $param1 == "browser" ]; then
        uploadBrowser
    else
        echo "ftp脚本参数错误"
    fi
}

changeUpload
