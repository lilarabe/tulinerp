#!/bin/bash

#获取当前时间戳
function getCurrentTimeStamp() {
    local current=$(date "+%Y-%m-%d %H:%M:%S")
    local timeStamp=$(date -d "$current" +%s)
    echo $timeStamp
}

#打印信息 $1:打印信息, $2:文字颜色
function printInfo() {
    local message="\e[1;36m$1\e[0m"
    case $2 in
    "r")
        message="\e[1;31m$1\e[0m"
        ;;
    "g")
        message="\e[1;32m$1\e[0m"
        ;;
    "b")
        message="\e[1;34m$1\e[0m"
        ;;
    *)
        message=$1
        ;;
    esac
    echo -e $message
}

#打印耗时
function printDuration() {
    let local "startTime = $1"
    let local "endTime = $2"
    let local "durTime = $2 - $1"
    let local "resultM = durTime / 60"
    let local "resultS = durTime % 60"
    printInfo "发布耗时: $resultM 分 $resultS 秒" "b"
}

#打印发布模式
function printPublishInfo() {
    printInfo "\n请输入发布模式:" "b"
    printInfo "(1)只发布android测试版." "g"
    printInfo "(2)只发布ios测试版." "g"
    printInfo "(3)只发布browser测试版." "g"
    printInfo "(4)发布测试版." "g"
    printInfo "(0)同步到正式版,并且发布." "r"
}

#询问发布模式
function getPublishMethod() {
    while [ -z $result ]; do
        read -p "清选择:" input
        if [ $input -ge 0 ] && [ $input -le 4 ]; then
            local result=$input
        else
            printInfo "请输入 y 或 n，或者 ctrl + c 退出" "r"
        fi
    done
    echo $result
}

#运行
function run() {
    case $1 in
    "1")
        npm run publish-android
        ;;
    "2")
        npm run publish-ios
        ;;
    "3")
        npm run publish-browser
        ;;
    "4")
        npm run publish-prod
        ;;
    "0")
        npm run publish-all
        ;;
    *) ;;
    esac
}

printPublishInfo
publishMethod=$(getPublishMethod)

#开始计时
startTime=$(getCurrentTimeStamp)

run $publishMethod

#结束计时
endTime=$(getCurrentTimeStamp)

printDuration startTime endTime
