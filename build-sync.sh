#!/bin/bash

host=""
user=""
# lobby
# google_login
svr="lobby-phil"
i=0
dev=''
hosts="192.168.88.214 192.168.88.218 192.168.88.217"

select host in $hosts; do
    case $host in
    "192.168.88.214")
        user="user-admin"
        dev="dev"
        break
        ;;
    "192.168.88.218")
        user="user-admin"
        break
        ;;
    "192.168.88.217")
        user="user-admin"
        dev="dev"
        break
        ;;
    *)
        echo "输入错误，请重新输入"
        ;;
    esac
done

npm run build:$dev

datename=$(date +"%m%d-%H%M%S")

ssh $user@$host "cd /data && cp -r /data/web/${svr} /data/web_bk/${svr}-${datename}"

ret=$?
if (($ret == 0)); then
    echo "ssh建立遠端備份成功"
else
    echo "ssh建立遠端備份失敗"
    exit
fi

ssh $user@$host "rm -r /data/web/${svr}"
ret=$?
if (($ret == 0)); then
    echo "ssh刪除舊檔成功"
else
    echo "ssh刪除舊檔失敗"
    exit
fi

if ! scp -r ./dist $user@$host:/data/web/${svr}; then
    echo scp $1 失敗
    exit
fi

echo $user $host

