# Import ENV variables into linux
declare -a vars=($(cat .env | tr '\n' ' '))
for var in ${vars[@]} 
do
  # export each variable into env
  # echo $var
  export $var
done