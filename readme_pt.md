# Aplicativo de Gerenciamento de Produtos e Anúncios

Aplicativo mobile desenvolvido para conclusão do curso de laboratório de programação. O sistema permite gerenciar produtos, anúncios em marketplaces e calcular margens de contribuição.

## 📋 Objetivo do Aplicativo

O aplicativo oferece as seguintes funcionalidades:

- **Cadastro de Produtos**: Persistência de produtos com informações como SKU, nome, descrição, custo e estoque
- **Busca Inteligente**: Pesquisa de produtos por SKU, nome ou código de barras (com suporte a leitura via câmera)
- **Calculadora de Margem de Contribuição**: Cálculo de margem de contribuição baseado no custo cadastrado do produto
- **Gerenciamento de Anúncios**: Registro de anúncios por marketplace com exibição das respectivas margens de contribuição
- **Calculadora de Margem de Pedido**: Cálculo da margem de contribuição de pedidos completos com múltiplos produtos e quantidades

## 🛠 Tecnologias Utilizadas

### Banco de Dados
- **PostgreSQL**: Banco de dados relacional para persistência dos dados

### Back-end
- **Flask**: Framework web Python para criação da API REST
- **SQLAlchemy**: ORM (Object-Relational Mapping) para orquestração das requisições ao banco de dados
- **Flask-CORS**: Middleware para habilitar CORS (Cross-Origin Resource Sharing)
- **python-dotenv**: Gerenciamento de variáveis de ambiente

### Front-end
- **React Native**: Framework para construção de aplicativos mobile multiplataforma
- **Expo CLI**: Ferramenta para desenvolvimento e emulação mobile
- **React Navigation**: Biblioteca para navegação entre telas
- **Expo Barcode Scanner**: Módulo para leitura de códigos de barras via câmera
- **Axios**: Cliente HTTP para comunicação com a API

## 📁 Estrutura do Projeto

```
projeto_final/
├── Backend/
│   ├── app.py                 # Aplicação principal Flask
│   ├── requirements.txt       # Dependências Python
│   ├── config/
│   │   ├── config.py          # Configurações da aplicação
│   │   └── database.py        # Configuração do banco de dados
│   ├── model/                 # Modelos SQLAlchemy
│   │   ├── product.py
│   │   ├── listing.py
│   │   └── product_annotation.py
│   ├── controller/            # Controladores (Blueprints)
│   │   ├── product_controller.py
│   │   ├── listing_controller.py
│   │   └── order_calculator_controller.py
│   ├── service/               # Lógica de negócio
│   │   ├── product_service.py
│   │   └── listing_service.py
│   └── exception/             # Tratamento de exceções
│       └── exception_handler.py
├── Frontend/
│   ├── App.js                 # Componente principal
│   ├── package.json           # Dependências Node.js
│   ├── src/
│   │   ├── screens/           # Telas do aplicativo
│   │   │   ├── ProductListScreen.js
│   │   │   ├── ProductFormScreen.js
│   │   │   ├── ListingScreen.js
│   │   │   ├── ListingFormScreen.js
│   │   │   ├── OrderCalculatorScreen.js
│   │   │   └── BarcodeScannerScreen.js
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── ProductItem.js
│   │   │   └── ListingItem.js
│   │   └── services/
│   │       └── api.js          # Configuração do cliente HTTP
└── Database/
    ├── schema.sql              # Script de criação do banco de dados
    └── modelagem.drawio        # Diagrama de modelagem
```

## 🚀 Como Utilizar o Aplicativo

### Pré-requisitos

- Python 3.8+ (com Conda para gerenciamento de ambiente)
- Node.js 16+ e npm
- PostgreSQL instalado e rodando
- Expo CLI instalado globalmente (`npm install -g expo-cli`)

### Configuração do Backend

1. **Criar ambiente virtual com Conda:**
   ```bash
   conda create -n projeto_final_japa python=3.13
   conda activate projeto_final_japa
   ```

2. **Instalar dependências:**
   ```bash
   cd Backend
   pip install -r requirements.txt
   ```

3. **Configurar variáveis de ambiente:**
   Crie um arquivo `.env` na pasta `Backend/` com o seguinte conteúdo:
   ```env
   # DATABASE CONFIG
   DATA_BASE_URL=localhost:5432/nome_do_banco
   DATA_BASE_USER=seu_usuario
   DATA_BASE_PASSWORD=sua_senha

   # BACKEND CONFIG
   BACKEND_PORT=5000
   ```

4. **Criar o banco de dados:**
   Execute o script `schema.sql` no PostgreSQL para criar as tabelas:
   ```bash
   psql -U seu_usuario -d nome_do_banco -f ../Database/schema.sql
   ```

5. **Executar o servidor:**
   ```bash
   python app.py
   ```
   O servidor estará disponível em `http://localhost:5000`

### Configuração do Frontend

1. **Instalar dependências:**
   ```bash
   cd Frontend
   npm install
   ```

2. **Configurar URL da API:**
   Crie um arquivo `.env` na pasta `Frontend/` com o seguinte conteúdo:
   ```env
   API_BASE_URL=http://192.168.0.8:5000/api
   ```
   > **Nota**: Substitua `192.168.0.8` pelo IP da sua máquina na rede local. Para descobrir seu IP no Windows, execute `ipconfig` no PowerShell e procure por "IPv4 Address".

3. **Executar o aplicativo:**
   ```bash
   npm start
   ```
   Em seguida, escolha uma das opções:
   - Pressione `a` para abrir no Android Emulator
   - Pressione `i` para abrir no iOS Simulator
   - Escaneie o QR code com o app Expo Go no seu dispositivo físico

## 📱 Funcionalidades do Aplicativo

### 1. Gerenciamento de Produtos
- Listar todos os produtos cadastrados
- Buscar produtos por SKU, nome ou código de barras
- Cadastrar novos produtos
- Editar produtos existentes
- Excluir produtos
- Calcular margem de contribuição no cadastro

### 2. Scanner de Código de Barras
- Acessar a câmera do dispositivo
- Escanear códigos de barras
- Usar o código escaneado para buscar produtos

### 3. Gerenciamento de Anúncios
- Listar todos os anúncios cadastrados
- Cadastrar novos anúncios vinculados a produtos
- Editar anúncios existentes
- Excluir anúncios
- Visualizar margem de contribuição de cada anúncio

### 4. Calculadora de Margem de Pedido
- Adicionar múltiplos produtos ao pedido
- Definir quantidades e preços unitários
- Calcular margem de contribuição total do pedido
- Visualizar detalhamento por item e resumo geral

## 🔧 API Endpoints

### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products?search={termo}` - Buscar produtos
- `GET /api/products/{id}` - Obter produto por ID
- `POST /api/products` - Criar produto
- `PUT /api/products/{id}` - Atualizar produto
- `DELETE /api/products/{id}` - Excluir produto
- `POST /api/products/{id}/contribution-margin` - Calcular margem de contribuição

### Anúncios
- `GET /api/listings` - Listar todos os anúncios
- `GET /api/listings?product_id={id}` - Listar anúncios por produto
- `GET /api/listings?marketplace={nome}` - Listar anúncios por marketplace
- `GET /api/listings/{id}` - Obter anúncio por ID
- `POST /api/listings` - Criar anúncio
- `PUT /api/listings/{id}` - Atualizar anúncio
- `DELETE /api/listings/{id}` - Excluir anúncio

### Calculadora de Pedido
- `POST /api/order-calculator/calculate` - Calcular margem de pedido

## 📊 Modelo de Dados

O banco de dados possui três tabelas principais:

1. **product**: Armazena informações dos produtos
2. **listing**: Armazena anúncios vinculados a produtos (relacionamento 1:N)
3. **product_annotation**: Armazena anotações sobre produtos (entidade fraca)

## 🐛 Solução de Problemas

### Backend não conecta ao banco de dados
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Verifique se o banco de dados foi criado

### Frontend não consegue se conectar à API
- Verifique se o backend está rodando
- Confirme o IP configurado no arquivo `.env` do Frontend
- Certifique-se de que o dispositivo/emulador está na mesma rede

### Erro ao escanear código de barras
- Verifique se as permissões da câmera foram concedidas
- No emulador, pode ser necessário configurar uma câmera virtual

## 📝 Notas de Desenvolvimento

Este projeto foi desenvolvido utilizando os conceitos e exemplos fornecidos nas aulas do curso de laboratório de programação, incluindo:
- Conceitos básicos de React Native
- Navegação em React Native
- Hooks e integração com back-end
- APIs multi-plataforma

## 👨‍💻 Autor

Desenvolvido como trabalho final do curso de laboratório de programação.

