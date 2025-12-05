from config.database import db
from datetime import datetime
from sqlalchemy.orm import relationship

class Product(db.Model):
    __tablename__ = 'product'
    
    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    image = db.Column(db.Text)
    cost = db.Column(db.Numeric(10, 2))
    update_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    inventory = db.Column(db.Integer, default=0)
    ean = db.Column(db.String(20))
    
    listings = relationship('Listing', backref='product', cascade='all, delete-orphan')
    annotations = relationship('ProductAnnotation', backref='product', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'product_id': self.product_id,
            'sku': self.sku,
            'name': self.name,
            'description': self.description,
            'image': self.image,
            'cost': float(self.cost) if self.cost else None,
            'update_at': self.update_at.isoformat() if self.update_at else None,
            'inventory': self.inventory,
            'ean': self.ean
        }

