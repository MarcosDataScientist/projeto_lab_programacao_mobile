from flask import Blueprint, request, jsonify
from service.listing_service import ListingService
from exception.exception_handler import handle_exception

listing_bp = Blueprint('listings', __name__)

@listing_bp.route('', methods=['GET'])
def get_listings():
    try:
        search_term = request.args.get('search')
        product_id = request.args.get('product_id')
        marketplace = request.args.get('marketplace')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Limitar per_page entre 1 e 100
        per_page = max(1, min(per_page, 100))
        
        if search_term:
            result = ListingService.search(search_term, page, per_page)
        elif product_id:
            result = ListingService.get_by_product_id(int(product_id), page, per_page)
        elif marketplace:
            result = ListingService.get_by_marketplace(marketplace, page, per_page)
        else:
            result = ListingService.get_all(page, per_page)
        
        return jsonify({
            'items': [l.to_dict() for l in result['items']],
            'pagination': {
                'total': result['total'],
                'pages': result['pages'],
                'current_page': result['current_page'],
                'per_page': result['per_page'],
                'has_next': result['has_next'],
                'has_prev': result['has_prev']
            }
        }), 200
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

