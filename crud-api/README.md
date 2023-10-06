### AWS-SAM and DynamoDb Setup

### Prerequisites
1. GitPod

***
#### dynamo-db conf in gitpod
```
<!-- run dynamo-db locally using docker -->

docker run -p 8000:8000 -d amazon/dynamodb-local
```
### installation aws-sam
```
curl -L "https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip" -o sam.zip

unzip sam.zip -d sam-installation

sudo ./sam-installation/install

sam --version // to check successfull installation
```

### installation aws-cli
```
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

unzip awscliv2.zip

sudo ./aws/install
```

#### configure aws
```
aws configure

key: [a-z]|[A-Z]|[0-9]
secret: [a-z]|[A-Z]|[0-9]
```

#### create table using aws-cli

```
aws dynamodb create-table --cli-input-json file://<filename>.json --endpoint-url <dynamodb-url>
```
#### list tables
```
aws dynamodb list-tables --endpoint <dynamodb-url>
```



***
#### Bootstrap sam-application
```
sam init // initialize sam
<!-- select required inputs -->
```

##### run sam using
```
sam local start-api
```
