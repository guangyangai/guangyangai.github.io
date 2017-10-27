---
layout: post
title: PySpark.sql v.s. Pandas
---
![alt text](http://spark.apache.org/docs/latest/api/python/_static/spark-logo-hd.png "Spark")![alt text](http://pandas.pydata.org/_static/pandas_logo.png "Pandas")

[Pyspark.sql](http://spark.apache.org/docs/latest/api/python/pyspark.sql.html) and [Pandas](http://pandas.pydata.org/pandas-docs/stable/) are both nice data analysis tools, providing fast and expressive data structures to work with relational or labeled data. Depends on the size of data for your analysis, you could choose either one as they have quite similar functionalities. These analysis will form the basis for applying machine learning on these data. Today let's do a pararrel comparison between *Pyspark.sql* and *Pandas*.




Features      | [pyspark.sql](https://s3.amazonaws.com/assets.datacamp.com/blog_assets/PySpark_SQL_Cheat_Sheet_Python.pdf)   | [pandas](https://github.com/pandas-dev/pandas/blob/master/doc/cheatsheet/Pandas_Cheat_Sheet.pdf)
------------- |:-------------:| --------:
Primary Data Structure     | DataFrame, Column, Row | Panel, DataFrame, Series 

Object Creation      | From RDDs, Spark data Sources (JSON, Parquet, CSV, TXT, AVRO)    |   From text, binary, SQL file 

Data Inspection | df.dtypes, df.show(), df.head(), df.first(), df.take(n), df.schema, df.describe().show(), df.columns, df.count(),df.distinct.count(),df.explain()   |    df['column_name'].value_counts(), df.info, df.desribe() 

Operation on DataFrame | Conversion, Indexing, Grouping/Aggregation,  Selection/Subsetting, Filtering, Joining| Conversion, Indexing, Iteration, Grouping/Aggregation, Function application, Selection/Subsetting, Filtering, Reshaping, Combining/Joining, Plotting 

Extensions     | [GeoSpark](https://github.com/DataSystemsLab/GeoSpark)      | [GeoPandas](https://github.com/geopandas/geopandas)


