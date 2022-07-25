Passos para correr o trabalho:
 
- sudo systemctl restart docker.service
- sudo chmod 777 /var/run/docker.sock

2- docker build login_system -t vr2_auth:latest
3- docker build http_server1 -t vr2_http:latest
4- docker-compose -f docker-compose.yml up --build

Quando é preciso limpar o docker fazíamos:
1- docker rm $(docker ps -a -q) para remover os containers existentes
1.1- caso os containers estivessem a UP, tínhamos de fazer stop com o comando: docker stop (ID container)

Quando era preciso eliminar uma imagem era preciso
1- docker rmi $(docker images -a -q)
1.1- docker rmi (nome/ID da imagem a eliminar) caso fosse só uma a eliminar

Quando era preciso remover um volume
1- docker volume ls : para ver todos os volumes
1.1- docker volume rm (nome do volume a eliminar)

- docker compose down 
mandar tudo abaixo para novas imagens
