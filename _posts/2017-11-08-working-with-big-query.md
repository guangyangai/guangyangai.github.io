Currently supported format are: 
  * CSV
  * NEWLINE_DELIMITED_JSON
  * DATASTORE_BACKUP
  * AVRO
  * PARQUET (experimental)

Sometimes, we don't want to directly load the raw file. Instead we want to use **Spark** or **Pandas** to do some pre-processing (e.g. drop duplicates, adding new columns). Therefore, we may want to load these raw files into dataframes, do some operations on these dataframes and then load the processed dataframes into BigQuery. 

However, PySpark cannot use the **BigQueryOutputFormat** to directly load dataframes into BigQuery because, unlike Scala Spark, it cannot create Java GSON JsonObjects inside a map. Google doc has one (example)[https://cloud.google.com/dataproc/docs/tutorials/bigquery-connector-spark-example] which saves the data into Cloud Storage (JSON format), then invokes a bq command to load the result into BigQuery. You would need to remember to clean the intermediate JSON file after uploading.
