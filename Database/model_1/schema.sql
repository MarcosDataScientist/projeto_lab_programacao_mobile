-- Tabela Pai: Product
-- Entidade Forte
CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,        -- Identificador único (Auto-incremento)
    sku VARCHAR(50) UNIQUE NOT NULL,      -- SKU geralmente é único
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,                           -- Pode ser uma URL longa
    cost DECIMAL(10, 2),                  -- DECIMAL é melhor que FLOAT para dinheiro
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    inventory INTEGER DEFAULT 0
);

-- Tabela: Listing
-- Relacionamento: 1 Produto tem N Listings (Listagens)
CREATE TABLE listing (
    marketplace_item_id VARCHAR(100) PRIMARY KEY, -- ID vindo do Marketplace (ex: MLB12345)
    price DECIMAL(10, 2) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    marketplace VARCHAR(50) NOT NULL,
    product_id INTEGER NOT NULL,          -- Chave Estrangeira
    
    CONSTRAINT fk_listing_product 
        FOREIGN KEY (product_id) 
        REFERENCES product (product_id)
        ON DELETE RESTRICT                -- Impede deletar produto se houver anúncio ativo
);

-- Tabela: Product_annotation
-- Entidade Fraca (representada pelo retângulo duplo)
-- Depende exclusivamente da existência do Produto
CREATE TABLE product_annotation (
    annotation_id SERIAL PRIMARY KEY,     -- Chave substituta para facilitar
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    product_id INTEGER NOT NULL,          -- Chave Estrangeira
    
    CONSTRAINT fk_annotation_product 
        FOREIGN KEY (product_id) 
        REFERENCES product (product_id) 
        ON DELETE CASCADE                 -- Se o produto sumir, a anotação também some (Regra de Entidade Fraca)
);