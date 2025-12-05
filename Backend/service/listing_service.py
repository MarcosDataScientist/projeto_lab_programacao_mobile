from model.listing import Listing
from model.product import Product
from config.database import db
from sqlalchemy import or_

class ListingService:
    @staticmethod
    def get_all(page=1, per_page=20):
        """Retorna anúncios paginados"""
        pagination = Listing.query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        return {
            'items': pagination.items,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': pagination.page,
            'per_page': pagination.per_page,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    
    @staticmethod
    def get_by_marketplace_item_id(marketplace_item_id):
        return Listing.query.get(marketplace_item_id)
    
    @staticmethod
    def get_by_product_id(product_id, page=1, per_page=20):
        query = Listing.query.filter_by(product_id=product_id)
        pagination = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        return {
            'items': pagination.items,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': pagination.page,
            'per_page': pagination.per_page,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    
    @staticmethod
    def get_by_marketplace(marketplace, page=1, per_page=20):
        query = Listing.query.filter_by(marketplace=marketplace)
        pagination = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        return {
            'items': pagination.items,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': pagination.page,
            'per_page': pagination.per_page,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    
    @staticmethod
    def search(search_term, page=1, per_page=20):
        """Busca anúncios pelo nome do produto com paginação"""
        if not search_term:
            return ListingService.get_all(page, per_page)
        
        search_pattern = f"%{search_term}%"
        query = Listing.query.join(Product).filter(
            Product.name.ilike(search_pattern)
        )
        pagination = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        return {
            'items': pagination.items,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': pagination.page,
            'per_page': pagination.per_page,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }
    
    @staticmethod
    def create(data):
        product = Product.query.get(data.get('product_id'))
        if not product:
            raise ValueError("Produto não encontrado")
        
        listing = Listing(
            marketplace_item_id=data.get('marketplace_item_id'),
            price=data.get('price'),
            marketplace=data.get('marketplace'),
            product_id=data.get('product_id')
        )
        db.session.add(listing)
        db.session.commit()
        return listing
    
    @staticmethod
    def update(marketplace_item_id, data):
        listing = Listing.query.get(marketplace_item_id)
        if not listing:
            return None
        
        if 'price' in data:
            listing.price = data['price']
        if 'marketplace' in data:
            listing.marketplace = data['marketplace']
        if 'product_id' in data:
            product = Product.query.get(data['product_id'])
            if not product:
                raise ValueError("Produto não encontrado")
            listing.product_id = data['product_id']
        
        db.session.commit()
        return listing
    
    @staticmethod
    def delete(marketplace_item_id):
        listing = Listing.query.get(marketplace_item_id)
        if not listing:
            return False
        
        db.session.delete(listing)
        db.session.commit()
        return True

