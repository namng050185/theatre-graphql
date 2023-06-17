export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;
nvm use 16

NODE_ENV=local npm run start:dev

