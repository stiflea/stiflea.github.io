import{_ as a}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as s,c as n,e}from"./app.b0df6560.js";const t={},l=e(`<h1 id="centos-安装-docker" tabindex="-1"><a class="header-anchor" href="#centos-安装-docker" aria-hidden="true">#</a> CentOS 安装 Docker</h1><p>安装步骤</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">sudo</span> yum remove <span class="token function">docker</span> <span class="token punctuation">\\</span>
                  docker-client <span class="token punctuation">\\</span>
                  docker-client-latest <span class="token punctuation">\\</span>
                  docker-common <span class="token punctuation">\\</span>
                  docker-latest <span class="token punctuation">\\</span>
                  docker-latest-logrotate <span class="token punctuation">\\</span>
                  docker-logrotate <span class="token punctuation">\\</span>
                  docker-engine
                  
<span class="token function">sudo</span> yum <span class="token function">install</span> <span class="token parameter variable">-y</span> yum-utils

<span class="token function">sudo</span> yum-config-manager <span class="token punctuation">\\</span>
    --add-repo <span class="token punctuation">\\</span>
    https://download.docker.com/linux/centos/docker-ce.repo

<span class="token function">sudo</span> yum <span class="token function">install</span> <span class="token parameter variable">-y</span> docker-ce docker-ce-cli containerd.io docker-compose-plugin

<span class="token function">sudo</span> systemctl start <span class="token function">docker</span>

<span class="token function">sudo</span> <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /etc/docker
<span class="token function">sudo</span> <span class="token function">tee</span> /etc/docker/daemon.json <span class="token operator">&lt;&lt;-</span><span class="token string">&#39;EOF&#39;
{
  &quot;registry-mirrors&quot;: [&quot;https://2j617oo7.mirror.aliyuncs.com&quot;]
}
EOF</span>
<span class="token function">sudo</span> systemctl daemon-reload
<span class="token function">sudo</span> systemctl restart <span class="token function">docker</span>



<span class="token function">docker</span> run <span class="token parameter variable">-itd</span> <span class="token parameter variable">--name</span> mysql <span class="token parameter variable">-p</span> <span class="token number">3306</span>:3306 <span class="token parameter variable">-e</span> <span class="token assign-left variable">MYSQL_ROOT_PASSWORD</span><span class="token operator">=</span>dean123 mysql
<span class="token function">docker</span> run <span class="token parameter variable">--name</span> redis <span class="token parameter variable">-p</span> <span class="token number">6379</span>:6379 <span class="token parameter variable">-d</span> <span class="token parameter variable">--restart</span><span class="token operator">=</span>always redis <span class="token parameter variable">--appendonly</span> <span class="token function">yes</span> <span class="token parameter variable">--requirepass</span> dean123
<span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span> nacos <span class="token parameter variable">-p</span> <span class="token number">8848</span>:8848 <span class="token parameter variable">-p</span> <span class="token number">9848</span>:9848 <span class="token parameter variable">-p</span> <span class="token number">9849</span>:9849 <span class="token parameter variable">-e</span> <span class="token assign-left variable">PREFER_HOST_MODE</span><span class="token operator">=</span>hostname <span class="token parameter variable">-e</span> <span class="token assign-left variable">MODE</span><span class="token operator">=</span>standalone nacos/nacos-server
<span class="token function">docker</span> run <span class="token parameter variable">-it</span> <span class="token parameter variable">--name</span> postgres <span class="token parameter variable">--restart</span> always <span class="token parameter variable">-e</span> <span class="token assign-left variable">POSTGRES_PASSWORD</span><span class="token operator">=</span><span class="token string">&#39;dean123&#39;</span> <span class="token parameter variable">-p</span> <span class="token number">5432</span>:5432 <span class="token parameter variable">-d</span> postgres



<span class="token function">docker</span> network create elastic

<span class="token function">docker</span> pull docker.elastic.co/elasticsearch/elasticsearch:8.3.3
<span class="token function">docker</span> pull docker.elastic.co/kibana/kibana:8.3.3

<span class="token comment"># 挂载文件</span>
<span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /data/docker/elasticsearch/config
<span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /data/docker/elasticsearch/data
<span class="token builtin class-name">echo</span> <span class="token string">&quot;http.host: 0.0.0.0&quot;</span> <span class="token operator">&gt;</span>/data/docker/elasticsearch/config/elasticsearch.yml
<span class="token function">chmod</span> <span class="token parameter variable">-R</span> <span class="token number">777</span> /data/docker/elasticsearch/

<span class="token function">docker</span> run <span class="token parameter variable">--name</span> elasticsearch <span class="token parameter variable">--net</span> elastic <span class="token parameter variable">-p</span> <span class="token number">9200</span>:9200 <span class="token parameter variable">-p</span> <span class="token number">9300</span>:9300 <span class="token punctuation">\\</span>
<span class="token parameter variable">-e</span>  <span class="token string">&quot;discovery.type=single-node&quot;</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">-e</span> <span class="token string">&quot;xpack.security.enabled=false&quot;</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">-e</span> <span class="token assign-left variable">ES_JAVA_OPTS</span><span class="token operator">=</span><span class="token string">&quot;-Xms1024m -Xmx1024m&quot;</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> /data/docker/elasticsearch/data:/usr/share/elasticsearch/data <span class="token punctuation">\\</span>
<span class="token parameter variable">-v</span> /data/docker/elasticsearch/plugins:/usr/share/elasticsearch/plugins <span class="token punctuation">\\</span>
<span class="token parameter variable">-it</span> docker.elastic.co/elasticsearch/elasticsearch:8.3.3


<span class="token function">docker</span> run <span class="token parameter variable">--name</span> elasticsearch <span class="token parameter variable">--net</span> elastic <span class="token parameter variable">-p</span> <span class="token number">9200</span>:9200 <span class="token parameter variable">-p</span> <span class="token number">9300</span>:9300 <span class="token punctuation">\\</span>
<span class="token parameter variable">-e</span>  <span class="token string">&quot;discovery.type=single-node&quot;</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">-e</span> <span class="token string">&quot;xpack.security.enabled=false&quot;</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">-e</span> <span class="token assign-left variable">ES_JAVA_OPTS</span><span class="token operator">=</span><span class="token string">&quot;-Xms1024m -Xmx1024m&quot;</span> <span class="token punctuation">\\</span>
<span class="token parameter variable">-it</span> docker.elastic.co/elasticsearch/elasticsearch:8.3.3


<span class="token function">docker</span> run <span class="token parameter variable">--name</span> kibana <span class="token parameter variable">--net</span> elastic <span class="token parameter variable">-p</span> <span class="token number">5601</span>:5601 docker.elastic.co/kibana/kibana:8.3.3



</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3),i=[l];function c(r,p){return s(),n("div",null,i)}const u=a(t,[["render",c],["__file","Docker.html.vue"]]);export{u as default};
