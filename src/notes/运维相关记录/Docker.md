# CentOS 安装 Docker

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
docker run -d --name nacos -p 9848:9848 -p 8848:8848 -e PREFER_HOST_MODE=hostname -e MODE=standalone nacos/nacos-server
docker run -it --name postgres --restart always -e POSTGRES_PASSWORD='dean123' -p 5432:5432 -d postgres

```

