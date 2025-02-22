import dash
from dash import dcc, html
import plotly.graph_objs as go
import random

app = dash.Dash(_name_)

def get_live_data():
    return random.randint(25000, 28000)  # Simulating BTC price

app.layout = html.Div([
    dcc.Graph(
        id="live-graph",
        figure={
            "data": [go.Scatter(y=[get_live_data()], mode="lines")],
            "layout": go.Layout(title="Real-Time Crypto Prices")
        }
    )
])

if _name_ == "_main_":
    app.run_server(debug=True)
