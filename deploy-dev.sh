docker build -t namng050185/nest-api:develop . --file Dockerfile.dev

docker login --username namng050185 --password dckr_pat_5hivzlrt7GRkv_E5S6YXHwxQNJo

docker push namng050185/nest-api:develop 