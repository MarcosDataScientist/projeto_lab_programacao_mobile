from config.database import db
from datetime import datetime

class Listing(db.Model):
    __tablename__ = 'listing'
    
    marketplace_item_id = db.Column(db.String(100), primary_key=True)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)
    marketplace = db.Column(db.String(50), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id', ondelete='RESTRICT'), nullable=False)
    
    def to_dict(self):
        return {
            'marketplace_item_id': self.marketplace_item_id,
            'price': float(self.price) if self.price else None,
            'registered_at': self.registered_at.isoformat() if self.registered_at else None,
            'marketplace': self.marketplace,
            'product_id': self.product_id,
            'product': self.product.to_dict() if self.product else None,
            'contribution_margin': self.calculate_contribution_margin()
        }
    
    def calculate_contribution_margin(self):
        """Calcula a margem de contribuição em percentual"""
        if self.product and self.product.cost and self.price:
            cost = float(self.product.cost)
            price = float(self.price)
            if cost > 0:
                margin = ((price - cost) / price) * 100
                return round(margin, 2)
        return None

