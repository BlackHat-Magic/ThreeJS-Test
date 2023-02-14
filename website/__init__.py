from flask import Flask
from os import path
# import json

def start():
    app = Flask(__name__)

    from .epmain import epmain

    app.register_blueprint(epmain, url_prefix="/")

    return app
