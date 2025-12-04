from flask import Blueprint, request, jsonify
from service.listing_service import ListingService
from exception.exception_handler import handle_exception

listing_bp = Blueprint('listings', __name__)

@listing_bp.route('', methods=['GET'])
def get_listings():
    try:
        product_id = request.args.get('product_id')
        marketplace = request.args.get('marketplace')
        
        if product_id:
            listings = ListingService.get_by_product_id(int(product_id))
        elif marketplace:
            listings = ListingService.get_by_marketplace(marketplace)
        else:
            listings = ListingService.get_all()
        
        return jsonify([l.to_dict() for l in listings]), 200
    except Exception as e:
        return handle_exception(e)

@listing_bp.route('/<marketplace_item_id>', methods=['GET'])
def get_listing(marketplace_item_id):
    try:
        listing = ListingService.get_by_marketplace_item_id(marketplace_item_id)
        if not listing:
            return jsonify({'error': 'Anúncio não encontrado'}), 404
        
        return jsonify(listing.to_dict()), 200
    except Exception as e:
        return handle_exception(e)

@listing_bp.route('', methods=['POST'])
def create_listing():
    try:
        data = request.get_json()
        
        # Validações
        errors = {}
        if not data.get('marketplace_item_id'):
            errors['marketplace_item_id'] = 'ID do marketplace é obrigatório'
        if not data.get('price'):
            errors['price'] = 'Preço é obrigatório'
        if not data.get('marketplace'):
            errors['marketplace'] = 'Marketplace é obrigatório'
        if not data.get('product_id'):
            errors['product_id'] = 'ID do produto é obrigatório'
        
        if errors:
            return jsonify({'errors': errors}), 400
        
        listing = ListingService.create(data)
        return jsonify(listing.to_dict()), 201
    except Exception as e:
        if 'não encontrado' in str(e):
            return jsonify({'error': str(e)}), 404
        return handle_exception(e)

@listing_bp.route('/<marketplace_item_id>', methods=['PUT'])
def update_listing(marketplace_item_id):
    try:
        data = request.get_json()
        listing = ListingService.update(marketplace_item_id, data)
        
        if not listing:
            return jsonify({'error': 'Anúncio não encontrado'}), 404
        
        return jsonify(listing.to_dict()), 200
    except Exception as e:
        if 'não encontrado' in str(e):
            return jsonify({'error': str(e)}), 404
        return handle_exception(e)

@listing_bp.route('/<marketplace_item_id>', methods=['DELETE'])
def delete_listing(marketplace_item_id):
    try:
        success = ListingService.delete(marketplace_item_id)
        if not success:
            return jsonify({'error': 'Anúncio não encontrado'}), 404
        
        return jsonify({'message': 'Anúncio excluído com sucesso'}), 200
    except Exception as e:
        return handle_exception(e)

