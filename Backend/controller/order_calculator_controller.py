from flask import Blueprint, request, jsonify
from service.product_service import ProductService
from exception.exception_handler import handle_exception

order_calculator_bp = Blueprint('order_calculator', __name__)

@order_calculator_bp.route('/calculate', methods=['POST'])
def calculate_order_margin():
    """
    Calcula a margem de contribuição de um pedido completo
    Body esperado:
    {
        "items": [
            {"product_id": 1, "quantity": 2, "price": 100.00},
            {"product_id": 2, "quantity": 1, "price": 50.00}
        ]
    }
    """
    try:
        data = request.get_json()
        items = data.get('items', [])
        
        if not items:
            return jsonify({'error': 'Lista de itens não pode estar vazia'}), 400
        
        total_cost = 0
        total_revenue = 0
        order_items = []
        
        for item in items:
            product_id = item.get('product_id')
            quantity = item.get('quantity', 1)
            price = item.get('price')
            
            if not product_id or not price:
                return jsonify({'error': 'Cada item deve ter product_id e price'}), 400
            
            product = ProductService.get_by_id(product_id)
            if not product:
                return jsonify({'error': f'Produto {product_id} não encontrado'}), 404
            
            item_cost = float(product.cost) if product.cost else 0
            item_revenue = float(price) * quantity
            item_total_cost = item_cost * quantity
            
            total_cost += item_total_cost
            total_revenue += item_revenue
            
            margin = ((item_revenue - item_total_cost) / item_revenue * 100) if item_revenue > 0 else 0
            
            order_items.append({
                'product_id': product_id,
                'product_name': product.name,
                'quantity': quantity,
                'unit_price': price,
                'unit_cost': item_cost,
                'total_revenue': round(item_revenue, 2),
                'total_cost': round(item_total_cost, 2),
                'contribution_margin': round(margin, 2)
            })
        
        order_margin = ((total_revenue - total_cost) / total_revenue * 100) if total_revenue > 0 else 0
        
        return jsonify({
            'order_items': order_items,
            'summary': {
                'total_cost': round(total_cost, 2),
                'total_revenue': round(total_revenue, 2),
                'total_profit': round(total_revenue - total_cost, 2),
                'contribution_margin': round(order_margin, 2)
            }
        }), 200
    except Exception as e:
        return handle_exception(e)

