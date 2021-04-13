#! /bin/bash

echo "git:切换 tulinerp 分支"
git checkout tulinerp
echo "git:拉取 tulinerp 分支"
git pull origin tulinerp
echo "git:切换 com.trendzone.tulinerp 分支"
git checkout com.trendzone.tulinerp 
echo "git:合并 tulinerp 分支 src 目录到 com.trendzone.tulinerp 分支 src"
git checkout tulinerp src