from model.product import Product
from config.database import db
from sqlalchemy import or_

class ProductService:
    @staticmethod
    def get_all():
        return Product.query.all()
    
    @staticmethod
    def get_by_id(product_id):
        return Product.query.get(product_id)
    
    @staticmethod
    def search(search_term):
        """Busca produtos por SKU, nome ou código de barras"""
        if not search_term:
            return Product.query.all()
        
        search_pattern = f"%{search_term}%"
        return Product.query.filter(
            or_(
                Product.sku.ilike(search_pattern),
                Product.name.ilike(search_pattern),
                Product.sku == search_term 
            )
        ).all()
    
    @staticmethod
    def create(data):
        product = Product(
            sku=data.get('sku'),
            name=data.get('name'),
            description=data.get('description'),
            image=data.get('image'),
            cost=data.get('cost'),
            inventory=data.get('inventory', 0)
        )
        db.session.add(product)
        db.session.commit()
        return product
    
    @staticmethod
    def update(product_id, data):
        product = Product.query.get(product_id)
        if not product:
            return None
        
        if 'sku' in data:
            product.sku = data['sku']
        if 'name' in data:
            product.name = data['name']
        if 'description' in data:
            product.description = data['description']
        if 'image' in data:
            product.image = data['image']
        if 'cost' in data:
            product.cost = data['cost']
        if 'inventory' in data:
            product.inventory = data['inventory']
        
        db.session.commit()
        return product
    
    @staticmethod
    def delete(product_id):
        product = Product.query.get(product_id)
        if not product:
            return False
        
        db.session.delete(product)
        db.session.commit()
        return True
    
    @staticmethod
    def calculate_contribution_margin(product_id, price):
        """Calcula a margem de contribuição de um produto"""
        product = Product.query.get(product_id)
        if not product or not product.cost:
            return None
        
        cost = float(product.cost)
        if cost > 0:
            margin = ((price - cost) / price) * 100
            return round(margin, 2)
        return None

