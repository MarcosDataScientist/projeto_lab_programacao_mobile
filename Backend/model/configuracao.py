from config.database import db
from datetime import datetime

class Configuracao(db.Model):
    __tablename__ = 'configuracao'
    
    config_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    theme = db.Column(db.String(50), nullable=False)
    margem_minima = db.Column(db.Numeric(10, 2), nullable=False)
    margem_ideal = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'config_id': self.config_id,
            'theme': self.theme,
            'margem_minima': float(self.margem_minima) if self.margem_minima else None,
            'margem_ideal': float(self.margem_ideal) if self.margem_ideal else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


