CREATE TABLE Cliente (  
  codCliente INTEGER(5) NOT NULL,  
  nome VARCHAR(30) NOT NULL,  
  email VARCHAR(30), 
  senha VARCHAR(20), 
  codEndereco INTEGER(5) 
); 

 

CREATE TABLE Loja (  
    codLoja INTEGER(5) NOT NULL,  
    nome VARCHAR(30) NOT NULL 
); 

 

CREATE TABLE Produto (  
  codProduto INTEGER(7) NOT NULL,  
  nomeProd VARCHAR(30),  
  categoria VARCHAR(20),  
  preco DECIMAL(12,2),
  descricao TEXT,
  codCliente INTEGER(5),
); 

 

CREATE TABLE Pedido (  
  codPedido INTEGER(7) NOT NULL,  
  prazo_entrega DATE,  
  codCliente INTEGER(5),  
  codEndereco INTEGER(5) 
); 

 

CREATE TABLE Loja_Produto ( 
  codLoja INTEGER(5) NOT NULL,  
  codProduto INTEGER(5) NOT NULL  
); 

 

CREATE TABLE Item (  
  codItem INTEGER(5) NOT NULL,  
  preco DECIMAL(12,2),  
  qtde VARCHAR(20),  
  codProduto INTEGER(7), 
  codloja INTEGER(5), 
  codOrcamento INTEGER(5), 
  codPedido INTEGER(7) 
); 

 

CREATE TABLE Endereco ( 
  codEndereco INTEGER(5), 
  endereco VARCHAR(30),  
  cidade VARCHAR(20),  
  cep VARCHAR(10),  
  uf CHAR(2) 
); 

 

CREATE TABLE Orcamento ( 
  codOrcamento INTEGER(5), 
  preco DECIMAL(10, 2), 
  especificacoes VARCHAR(100) 
); 

------------------------------------------------------------ 

 

ALTER TABLE Cliente  

ADD CONSTRAINT PK_Cliente_codCliente PRIMARY KEY(codCliente); 

 

ALTER TABLE Loja  

ADD CONSTRAINT PK_Loja_codLoja PRIMARY KEY(codLoja); 

 

ALTER TABLE Produto  

ADD CONSTRAINT PK_Produto_codProduto PRIMARY KEY(codProduto); 

 

ALTER TABLE Pedido 

ADD CONSTRAINT PK_Pedido_codPedido PRIMARY KEY(codPedido); 

 

ALTER TABLE Loja_Produto  

ADD CONSTRAINT PK_LojaProduto_LojaProd PRIMARY KEY(codLoja, codProduto); 

 

ALTER TABLE Item  

ADD CONSTRAINT PK_Item_coditem PRIMARY KEY(Coditem); 

 

ALTER TABLE Endereco  

ADD CONSTRAINT PK_Endereco_codEndereco PRIMARY KEY(codEndereco); 

 

ALTER TABLE Orcamento  

ADD CONSTRAINT PK_Orcamento_codOrcamento PRIMARY KEY(codOrcamento); 

 

ALTER TABLE Cliente  
ADD CONSTRAINT FK_Cliente_codEndereco 
FOREIGN KEY(codEndereco)  REFERENCES Endereco(codEndereco); 

ALTER TABLE Pedido  
ADD CONSTRAINT FK_Pedido_codCliente 
FOREIGN KEY(codCliente)  REFERENCES Cliente(codCliente); 

  

ALTER TABLE Pedido  
ADD CONSTRAINT FK_Pedido_codEndereco FOREIGN KEY(codEndereco)  
REFERENCES Endereco(codEndereco); 

 

ALTER TABLE Item 

ADD CONSTRAINT FK_Item_codProduto FOREIGN KEY(codProduto)  

REFERENCES Produto(codProduto); 

  

ALTER TABLE Item  

ADD CONSTRAINT FK_Item_codLoja FOREIGN KEY(codLoja)  

REFERENCES Loja(codLoja); 

  

ALTER TABLE Item  

ADD CONSTRAINT FK_Item_codOrcamento FOREIGN KEY(codOrcamento)  

REFERENCES Orcamento(codOrcamento); 

 

ALTER TABLE Item  

ADD CONSTRAINT FK_Item_codPedido FOREIGN KEY(codPedido)  

REFERENCES Pedido(codPedido); 