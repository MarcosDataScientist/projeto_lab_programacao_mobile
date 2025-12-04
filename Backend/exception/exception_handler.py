from flask import jsonify
import traceback

def handle_exception(e):
    """Trata exceções e retorna resposta JSON apropriada"""
    error_message = str(e)
    traceback.print_exc()
    
    return jsonify({
        'error': 'Erro interno do servidor',
        'message': error_message
    }), 500

