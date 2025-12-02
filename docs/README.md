<!--API Clientes-->

## API Clientes

### Clientes

#### GET/clientes
- **Descrição**: Obtém uma lista de Clientes
- **Response**: Array de clientes

#### POST/clientes
- **Descrição**: Cria um novo Cliente
- **Body**: 
```
{
    "nomeCliente": "nome e sobrenome",
	"cpfCliente": "12345678910",
	"telefoneCliente": "85997211459",
	"emailCliente": "nome.sobrenome@example.com",
	"enderecoCliente": "Rua Fortaleza, 312, Meireles, Fortaleza, CE, 60160-250"
}
```
- **Response**: 
```
{
    "message": "Cliente cadastrado com sucesso!"
}
```

#### PUT/clientes/idCliente
- **Descrição**: Atualiza um Cliente já existente
- **Body**:
```
{
    "nomeCliente": "nome e sobrenome atualizado",
	"cpfCliente": "12345678910",
	"telefoneCliente": "85997211459",
	"emailCliente": "nome.sobrenome@example.com",
	"enderecoCliente": "Rua Fortaleza, 312, Meireles, Fortaleza, CE, 60160-250"
}
```
- **Response**:
```
{
    "message": "Cliente atualizado com sucesso!"
}
```


#### DELETE/clientes/idCliente
- **Descrição**: Deleta um Cliente já existente
- **Response**:
```
{
    "message": "Cliente deletado com sucesso!"
}
```

<!--API Pedidos-->

## API Pedidos

### Pedidos

#### GET/pedidos
- **Descrição**: Obtém uma lista de Pedidos
- **Response**: Array de pedidos

#### POST/pedidos
- **Descrição**: Cria um novo Pedido
- **Body**: 
```
{
    "idCliente": "78CA14ED-8105-4BE7-B7C2-E6E536708D0E",
    "dataPedido": "2025-10-03",
    "tipoEntrega": "urgente",
    "distanciaKm": 70,
    "pesoCarga": 28.5,
    "valorKm": 4.7,
    "valorKg": 2.9
}
```
- **Response**: 
```
{
    "message": "Pedido cadastrado com sucesso!"
}
```

#### PUT/pedidos/idPedido
- **Descrição**: Atualiza um Pedido já existente
- **Body**:
```
{
    "dataPedido": "2025-10-03",
    "tipoEntrega": "normal",
    "distanciaKm": 70,
    "pesoCarga": 28.5,
    "valorKm": 4.7,
    "valorKg": 2.9
}
```
- **Response**:
```
{
    "message": "Pedido atualizado com sucesso!"
}
```


#### DELETE/pedidos/idPedido
- **Descrição**: Deleta um Pedido já existente
- **Response**:
```
{
    "message": "Pedido deletado com sucesso!"
}
```

<!--API Entregas-->
## API Entregas

### Entregas

#### GET/entregas
- **Descrição**: Obtém uma lista de Entregas
- **Response**: Array de entregas

#### POST/entregas
- **Descrição**: Cria uma nova Entrega diretamente depois de um novo Pedido ja ser criado
- **Response**: 
```
{
    "message": "Entrega cadastrada com sucesso!"
}
```