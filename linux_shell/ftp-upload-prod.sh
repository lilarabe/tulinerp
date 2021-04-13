#!/bin/sh
# lftp -u tulin-hotfix,Dandian=6 sftp://118.25.74.169:10167 <<EOF

set file:charset  "UTF-8"

HOST=118.25.74.169:10167
PASS=Dandian=6

USER1=tulin-hotfix
USER2=tulin-mobile

echo "连接热更新服务器..."

lftp -u ${USER1},${PASS} sftp://${HOST} <<EOF

echo "更新热更新内容..."
cd /var/www/Tulin-Hotfix/com_trendzone_tulinerp

echo "删除android目录..."
rm -r android/
echo "删除iso目录..."
rm -r ios/
echo "删除browser目录..."
rm -r browser

echo "上传目录..."
mirror -R ./dist/com_trendzone_tulinerp/prod /var/www/Tulin-Hotfix/com_trendzone_tulinerp

bye
EOF

echo "热更新发布完成"


echo "连接QBMOBILE服务器..."
lftp -u ${USER2},${PASS} sftp://${HOST} <<EOF
echo "更新浏览器内容..."
cd /var/www/Cloud_CFS/QBWEB/Mapp/Yun_Production

echo "删除mapp目录..."
mirror -Re ./none /var/www/Cloud_CFS/QBWEB/Mapp/Yun_Production

echo "上传文件..."
mirror -R ./dist/com_trendzone_tulinerp/prod/browser /var/www/Cloud_CFS/QBWEB/Mapp/Yun_Production
bye
EOF
echo "QBMOBILE发布完成"