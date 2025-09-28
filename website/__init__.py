from flask import Flask, render_template

def start():
    app = Flask(__name__, static_folder="static", template_folder="templates")

    @app.route("/")
    def home():
        return render_template("index.html", title="Home")

    return app