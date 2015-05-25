# DECAY function usage

[Function Score Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html)

Search body:
```json
{
            "query": {
                "function_score": {
                    "score_mode": "first",
                    "query": {
                        "match": {
                            "title": '钱包'
                        }
                    },

                    "functions": [
                        {
                            "filter": {
                                "exists": {
                                    "field": "updatedAt"
                                }
                            },
                            "gauss": {
                                "updatedAt": {
                                    "scale": "10d",
                                    "offset": "5d",
                                    "decay" : 0.5
                                }
                            }
                        }
                    ]
                }
            }
        }
```

> If an offset is defined, the decay function will only compute the decay function for documents with a distance greater that the defined  offset. The default is 0.

> The decay parameter defines how documents are scored at the distance given at scale. If no decay is defined, documents at the distance  scale will be scored 0.5.