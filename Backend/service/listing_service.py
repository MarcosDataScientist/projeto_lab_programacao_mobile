from model.listing import Listing
from model.product import Product
from config.database import db

class ListingService:
    @staticmethod
    def get_all():
        return Listing.query.all()
    
    @staticmethod
    def get_by_marketplace_item_id(marketplace_item_id):
        return Listing.query.get(marketplace_item_id)
    
    @staticmethod
    def get_by_product_id(product_id):
        return Listing.query.filter_by(product_id=product_id).all()
    
    @staticmethod
    def get_by_marketplace(marketplace):
        return Listing.query.filter_by(marketplace=marketplace).all()
    
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

