from flask import Flask
from flask_cors import CORS
from config.database import db
from config.config import Config
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def create_app():
    app = Flask(__name__)
    
    app.config.from_object(Config)
    
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    db.init_app(app)
    
    from controller.product_controller import product_bp
    from controller.listing_controller import listing_bp
    from controller.order_calculator_controller import order_calculator_bp
    
    app.register_blueprint(product_bp, url_prefix='/api/products')
    app.register_blueprint(listing_bp, url_prefix='/api/listings')
    app.register_blueprint(order_calculator_bp, url_prefix='/api/order-calculator')
    
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('BACKEND_PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

