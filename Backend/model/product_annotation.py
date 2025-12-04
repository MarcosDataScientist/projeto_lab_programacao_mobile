from config.database import db
from datetime import datetime

class ProductAnnotation(db.Model):
    __tablename__ = 'product_annotation'
    
    annotation_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id', ondelete='CASCADE'), nullable=False)
    
    def to_dict(self):
        return {
            'annotation_id': self.annotation_id,
            'text': self.text,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'product_id': self.product_id
        }

