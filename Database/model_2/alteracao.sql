-- Alteração 1: Adicionar atributo EAN na tabela product
ALTER TABLE product 
ADD COLUMN ean VARCHAR(20);

-- Alteração 2: Criar tabela de configuração
CREATE TABLE configuracao (
    config_id SERIAL PRIMARY KEY,
    theme VARCHAR(50) NOT NULL,
    margem_minima DECIMAL(10, 2) NOT NULL,
    margem_ideal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


