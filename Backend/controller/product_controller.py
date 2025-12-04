from flask import Blueprint, request, jsonify
from service.product_service import ProductService
from exception.exception_handler import handle_exception

product_bp = Blueprint('products', __name__)

@product_bp.route('', methods=['GET'])
def get_products():
    try:
        search_term = request.args.get('search', '')
        
        if search_term:
            products = ProductService.search(search_term)
        else:
            products = ProductService.get_all()
        
        return jsonify([p.to_dict() for p in products]), 200
    except Exception as e:
        return handle_exception(e)

@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = ProductService.get_by_id(product_id)
        if not product:
            return jsonify({'error': 'Produto não encontrado'}), 404
        
        return jsonify(product.to_dict()), 200
    except Exception as e:
        return handle_exception(e)

@product_bp.route('', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        
        # Validações
        errors = {}
        if not data.get('sku'):
            errors['sku'] = 'SKU é obrigatório'
        if not data.get('name'):
            errors['name'] = 'Nome é obrigatório'
        
        if errors:
            return jsonify({'errors': errors}), 400
        
        product = ProductService.create(data)
        return jsonify(product.to_dict()), 201
    except Exception as e:
        return handle_exception(e)

@product_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        data = request.get_json()
        product = ProductService.update(product_id, data)
        
        if not product:
            return jsonify({'error': 'Produto não encontrado'}), 404
        
        return jsonify(product.to_dict()), 200
    except Exception as e:
        return handle_exception(e)

@product_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        success = ProductService.delete(product_id)
        if not success:
            return jsonify({'error': 'Produto não encontrado'}), 404
        
        return jsonify({'message': 'Produto excluído com sucesso'}), 200
    except Exception as e:
        return handle_exception(e)

@product_bp.route('/<int:product_id>/contribution-margin', methods=['POST'])
def calculate_contribution_margin(product_id):
    try:
        data = request.get_json()
        price = data.get('price')
        
        if not price:
            return jsonify({'error': 'Preço é obrigatório'}), 400
        
        margin = ProductService.calculate_contribution_margin(product_id, float(price))
        
        if margin is None:
            return jsonify({'error': 'Não foi possível calcular a margem'}), 400
        
        return jsonify({'contribution_margin': margin}), 200
    except Exception as e:
        return handle_exception(e)

