from distutils.log import error
import socket
import _thread
 
HOST = '127.0.0.1'      # Endereco IP do Servidor
PORT = 5001   # Porta que o Servidor está

def lerlinhas():
    with open("mib.txt") as f:
        linhas = f.readlines()
    
    f.close()
    return linhas


def comando(comando_cli):
    if(comando_cli[0]== 'snmpget'):
        comando2=get(comando_cli)
    
    else:
        if(comando_cli[0] == 'snmpgetnext'):
            comando2=getnext(comando_cli)
        if(comando_cli[0]== 'snmpset'):
            comando2=setmib(comando_cli)
        if(comando_cli[0]== 'snmpbulkget'):
            comando2=bulkget(comando_cli)
        
    return comando2


def get(oid_mib):
    linha=lerlinhas()
    
    for l in range(0,len(linha)):
        comando = linha[l].split(" ")
        if comando[0] != "#" and comando[0] != '\n':
            if comando[0]== oid_mib[3]:
                return linha[l]    
    return print("erro")

def getnext(oid_mib):
    mib_line= lerlinhas()
    
    for l in range(0,len(mib_line)):
        comando = mib_line[l].split(" ")
        if comando[0] == oid_mib[3]:
            x=l+1
            comando1= mib_line[x]
            if  comando1[0] == "#":
                return mib_line[l+2]
            else: 
                return comando1
    return print("erro")

def replace_line(file_name, line_num, text):
    lines = open(file_name, 'r').readlines()
    lines[line_num] = text
    out = open(file_name, 'w')
    out.writelines(lines)
    out.close()

def checkInt(str):
    if str[0] in ('-', '+'):
        return str[1:].isdigit()
    return str.isdigit()

def setmib(oid_mib):
    with open("mib.txt") as f:
        linhas = f.readlines()
        for l in range(0,len(linhas)):
            comando = linhas[l].split(" ")
            if comando[0] != "#" and comando[0] != '\n':
                if comando[0] == oid_mib[3]:
                    if comando[1]=="INTEGER":
                        inteiro= checkInt(oid_mib[4])
                        if inteiro == True :
                            if comando[2]=="RW":
                                linha_nova = str(comando[0])+" "+str(comando[1])+" "+(comando[2])+" "+str(oid_mib[4])+"\n"
                                replace_line('mib.txt',l,linha_nova)
                                return linha_nova
                            else: 
                                erro='Este valor apenas pode ser lido!'
                                return (erro)
                        else: 
                                erro='O valor que pretende a alterar tem que ser um inteiro!'
                                return (erro)
                    else:
                        if comando[2]=="RW":
                            linha_nova = str(comando[0])+" "+str(comando[1])+" "+(comando[2])+" "+str(oid_mib[4])+"\n"
                            replace_line('mib.txt',l,linha_nova)
                            return linha_nova
                        else:
                            erro='Este valor apenas pode ser lido!'
                            return (erro)

        f.close()

def bulkget(oid_mib):
    with open("mib.txt") as f:
        linhas = f.readlines()
    lista_bulk= []
    for l in range(0,len(linhas)):
        comando =linhas[l].split(" ")
        if comando[0] != "#" and comando[0] != '\n':
                oid=str(oid_mib[3])
                oid_mib2=comando[0]
                
                if oid_mib2[:len(oid)]== oid:
                    new_oid=get_oid(oid_mib2)
                    lista_bulk.append(new_oid)
    return lista_bulk

def get_oid(oid_mib):
    linha=lerlinhas()
    
    for l in range(0,len(linha)):
        comando = linha[l].split(" ")
        if comando[0] != "#" and comando[0] != '\n':
            if comando[0]== oid_mib:
                return linha[l]    
    erro='Não existe nenhum oid na mib correspondente!'
    return erro

    



 
# Função chamada quando uma nova thread for iniciada
def conectado(con, cliente):
    print('\nCliente conectado:', cliente)
 
    while True:
        # Recebendo as mensagens através da conexão
        msg = con.recv(1024)
        if not msg:
            break
 
        print('\nCliente..:', cliente)
        print('Mensagem.:', msg)

        
        linha=lerlinhas()
        msg= msg.decode('utf-8')
        mensagem= msg.split(" ")
        resultado_mib =comando(mensagem)

        con.send(str(resultado_mib).encode())
        
        
 
    print('\nFinalizando conexao do cliente', cliente)
    con.close()
    _thread.exit()
 
tcp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
orig = (HOST, PORT)
 
# Colocando um endereço IP e uma porta no Socket
tcp.bind(orig)
 
# Colocando o Socket em modo passivo
tcp.listen(1)
print('\nServidor TCP concorrente iniciado no IP', HOST, 'na porta', PORT)
 
while True:
    # Aceitando uma nova conexão
    con, cliente = tcp.accept()
    print('\nNova thread iniciada para essa conexão')
 
    # Abrindo uma thread para a conexão
    _thread.start_new_thread(conectado, tuple([con, cliente]))
 
# Fechando a conexão com o Socket
tcp.close()