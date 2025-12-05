from model.configuracao import Configuracao
from config.database import db

class ConfiguracaoService:
    @staticmethod
    def get():
        """Retorna a primeira configuração (normalmente só existe uma)"""
        config = Configuracao.query.first()
        return config
    
    @staticmethod
    def get_or_create():
        """Retorna a configuração existente ou cria uma padrão"""
        config = Configuracao.query.first()
        if not config:
            # Criar configuração padrão
            config = Configuracao(
                theme='light',
                margem_minima=15.0,
                margem_ideal=30.0
            )
            db.session.add(config)
            db.session.commit()
        return config
    
    @staticmethod
    def create(data):
        """Cria uma nova configuração"""
        config = Configuracao(
            theme=data.get('theme', 'light'),
            margem_minima=data.get('margem_minima', 15.0),
            margem_ideal=data.get('margem_ideal', 30.0)
        )
        db.session.add(config)
        db.session.commit()
        return config
    
    @staticmethod
    def update(config_id, data):
        """Atualiza uma configuração existente"""
        config = Configuracao.query.get(config_id)
        if not config:
            return None
        
        if 'theme' in data:
            config.theme = data['theme']
        if 'margem_minima' in data:
            config.margem_minima = data['margem_minima']
        if 'margem_ideal' in data:
            config.margem_ideal = data['margem_ideal']
        
        db.session.commit()
        return config
    
    @staticmethod
    def update_or_create(data):
        """Atualiza a configuração existente ou cria uma nova"""
        config = Configuracao.query.first()
        if config:
            return ConfiguracaoService.update(config.config_id, data)
        else:
            return ConfiguracaoService.create(data)


