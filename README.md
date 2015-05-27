# Build Image
 Use [Dockerfile](https://raw.githubusercontent.com/zycbobby/easy_download/master/elasticsearch/Dockerfile)

# Config elastic search

## default option
Put the [Sample config file](es/etc.default.elasticsearch) in to /etc/default/elasticsearch
Config it for less memory usage

## Using less nodes and use ik-analyser for tokenizer

```yml
index:
  analysis:
    analyzer:
      ik:
          alias: [news_analyzer_ik,ik_analyzer]
          type: org.elasticsearch.index.analysis.IkAnalyzerProvider

index.analysis.analyzer.default.type : "ik"

bootstrap.mlockall: true

# Note, that for development on a local machine, with small indices, it usually
# makes sense to "disable" the distributed features:
#
index.number_of_shards: 1
index.number_of_replicas: 0
~
```

# Start docker

```bash
docker run -p 19200:9200 -v /mnt/ext/esdata:/usr/share/elasticsearch/data -ti es:wechat bash
```

# Start elastic search

```bash
/etc/init.d/elasticsearch start
```

# Create index,mapping and search

Like [here](https://github.com/zycbobby/easy_download/blob/master/elasticsearch/README.md#create-index)


# NODEJS profiling
[Profile](http://blog.eood.cn/node-js_gc)

How about node-inspector
Need to use heapdump

# NodeJS production
Considering strongloop
