import socket

HOST = '127.0.0.1'     # Endereço IP do Servidor

PORT = 5001     # Porta que o Servidor está

def checkMessage(mensagem):
    aux = 1
    if(mensagem[0] == "help" and len(mensagem) == 1):
        print("snmpget public localhost Id_oid ")
        print("snmpset public localhost Id_oid (valuer)")
        print("snmpgetnext public localhost Id_oid ")
        print("snmpbulkget public localhost Min MAx  Id_oid")
        print("snmpbulkget public localhost Id_oid \n ")
        return aux
    if(len(mensagem) > 3 and mensagem[1] == "public" and mensagem[2] == "localhost"):
        aux = 0
        return aux
    return aux

# Criando a conexão

tcp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

destino = (HOST, PORT)

tcp.connect(destino)



print('\nDigite o comando')


print('Para sair use CTRL+X\n')

# Recebendo a mensagem do usuário final pelo teclado

mensagem =""

aux = 1
# Enviando a mensagem para o Servidor TCP através da conexão

while mensagem != '\x18':
    while aux == 1:
        mensagem = input()
        print(mensagem)
        arrMensagem = mensagem.split(" ")
        print(arrMensagem)
        aux = checkMessage(arrMensagem)

    tcp.send(str(mensagem).encode())
    msg = tcp.recv(1024)
    mensagem = msg.decode('utf-8')
    print(mensagem)
    aux = 1

# Fechando o Socket

tcp.close()
