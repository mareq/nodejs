# Sample application written in Node.js

The application consisting of several interconnected modules, implemented as part of learning process. Therefore, it definitely is not showcase of good practices - you have been warned.

## Modules

### Data Generator

There is a small dataset present in this repository, but it is much more interesting to run with much bigger dataset. Data Generator can be used to generate random, arbitrary big datasets with the correct structure and interesting characteristics.


## Sender

Goes over all files present in designated data directory and sends them to the Receiver using RESTful API.


## Receiver

Provides RESTful API for receiving data from the Sender. Incomming data are stored on filesystem and metadata are stored to MongoDB.


## Raw Storage

Provides RESTful interface over ZeroMQ (rather than using standard HTTP) for processing the raw-data stored by Receiver.


## Indexer

Pulls raw-data from the Raw Storage and processes them by indexing the data using ElasticSearch.


