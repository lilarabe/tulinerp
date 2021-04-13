#! /bin/bash

echo "git:切换 com.trendzone.tulinerp 分支"
git checkout com.trendzone.tulinerp 
echo "git:提交 com.trendzone.tulinerp 分支"
git add -A
git commit -m"脚本据自动提交"
git push origin com.trendzone.tulinerp
echo "git:状态"
git status