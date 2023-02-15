from flask import Blueprint, Flask, render_template, redirect, url_for, request, session, flash, jsonify, send_from_directory
import json

epmain = Blueprint("epmain", __name__)

@epmain.after_request
def set_js_mime_type(response):
    if(response.content_type == "text/html"):
        response.headers["Content-Type"] = "text/javascript"
    return(response)

@epmain.route("/static/js/<path:path>")
def serve_js(path):
    return(send_from_directory("static/js", path))

@epmain.route("/")
def home():
    return(
        render_template(
            "index.html", 
            title="Home"
        )
    )
