from flask import Blueprint, request, jsonify
from service.configuracao_service import ConfiguracaoService
from exception.exception_handler import handle_exception

configuracao_bp = Blueprint('configuracao', __name__)

@configuracao_bp.route('', methods=['GET'])
def get_configuracao():
    try:
        config = ConfiguracaoService.get_or_create()
        return jsonify(config.to_dict()), 200
    except Exception as e:
        return handle_exception(e)

@configuracao_bp.route('', methods=['PUT'])
def update_configuracao():
    try:
        data = request.get_json()
        
        # Validações
        errors = {}
        if 'theme' in data and not data.get('theme'):
            errors['theme'] = 'Tema é obrigatório'
        if 'margem_minima' in data and data.get('margem_minima') is None:
            errors['margem_minima'] = 'Margem mínima é obrigatória'
        if 'margem_ideal' in data and data.get('margem_ideal') is None:
            errors['margem_ideal'] = 'Margem ideal é obrigatória'
        
        if errors:
            return jsonify({'errors': errors}), 400
        
        config = ConfiguracaoService.update_or_create(data)
        return jsonify(config.to_dict()), 200
    except Exception as e:
        return handle_exception(e)


