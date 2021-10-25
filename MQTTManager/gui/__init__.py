from re import template
from threading import local
from jinja2 import Template
from MQTTManager.app import webapp
from markupsafe import escape
from flask import Flask, request, render_template
from .menu import MAIN_FRAME
import os


@webapp.route("/")
def index():
    global MAIN_FRAME
    SIDE_BAR=MAIN_FRAME["side-bar"]
    return render_template("index.html", SIDE_BAR=SIDE_BAR)

@webapp.route("/mqtt/<page>")
def mqtt(page):
    global MAIN_FRAME
    SIDE_BAR=MAIN_FRAME["side-bar"]
    if page == "topics":
        return render_template("mqtt/topics.htm", SIDE_BAR=SIDE_BAR)
    elif page == "topics":
        return render_template("index.html", SIDE_BAR=SIDE_BAR)
    else:
        return render_template("index.html", SIDE_BAR=SIDE_BAR)

@webapp.route("/test")
def test():
    global MAIN_FRAME
    TOP_BAR=MAIN_FRAME["top-bar"]
    SIDE_BAR=MAIN_FRAME["side-bar"]
    t = Template("""
    <dl>
        {% for key, val in TOP_BAR.items() recursive %}
            {% if val is mapping %}
               <a>{{ loop(val.items()) }}</a>
            {% else %}
                <dt>{{ key|e }}</dt>
                <dd>{{ val|e }}</dd>
            {% endif %}
        {% endfor %}
    </dl>
    </br>
    <dl>
        {% for key, val in SIDE_BAR.items() recursive %}
            {% if val is mapping %}
               {%- k,v line in val %}
               {{ k }}
               {{ v }}
               {%  endfor -%}
            {% else %}
                <dt>{{ key|e }}</dt>
                <dd>{{ val|e }}</dd>
            {% endif %}
        {% endfor %}
    </dl>
    """)
    return render_template("template.htm",SIDE_BAR=SIDE_BAR)