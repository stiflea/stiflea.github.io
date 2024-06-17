---
title: CentOS 安装 Docker
author: 陈清华
isOriginal: true
---

# CentOS 安装 Docker
安装步骤
```bash
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
                  
sudo yum install -y yum-utils

sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

sudo systemctl start docker

sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://2j617oo7.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker



docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=dean123 mysql
docker run --name redis -p 6379:6379 -d --restart=always redis --appendonly yes --requirepass dean123
docker run -d --name nacos -p 8848:8848 -p 9848:9848 -p 9849:9849 -e PREFER_HOST_MODE=hostname -e MODE=standalone nacos/nacos-server
docker run -it --name postgres --restart always -e POSTGRES_PASSWORD='dean123' -p 5432:5432 -d postgres



docker network create elastic

docker pull docker.elastic.co/elasticsearch/elasticsearch:8.3.3
docker pull docker.elastic.co/kibana/kibana:8.3.3

# 挂载文件
mkdir -p /data/docker/elasticsearch/config
mkdir -p /data/docker/elasticsearch/data
echo "http.host: 0.0.0.0" >/data/docker/elasticsearch/config/elasticsearch.yml
chmod -R 777 /data/docker/elasticsearch/

docker run --name elasticsearch --net elastic -p 9200:9200 -p 9300:9300 \
-e  "discovery.type=single-node" \
-e "xpack.security.enabled=false" \
-e ES_JAVA_OPTS="-Xms1024m -Xmx1024m" \
-v /data/docker/elasticsearch/data:/usr/share/elasticsearch/data \
-v /data/docker/elasticsearch/plugins:/usr/share/elasticsearch/plugins \
-it docker.elastic.co/elasticsearch/elasticsearch:8.3.3

# 运行elk
docker run --name elasticsearch --net elastic -p 9200:9200 -p 9300:9300 \
-e  "discovery.type=single-node" \
-e "xpack.security.enabled=false" \
-e ES_JAVA_OPTS="-Xms1024m -Xmx1024m" \
-it docker.elastic.co/elasticsearch/elasticsearch:8.3.3


docker run --name kibana --net elastic -p 5601:5601 docker.elastic.co/kibana/kibana:8.3.3



```

