import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Sample dataset
data = pd.DataFrame({
    'market_volatility': np.random.rand(100),
    'liquidity': np.random.rand(100),
    'historical_returns': np.random.rand(100),
    'risk_category': np.random.choice([0, 1], 100)  # 0 = Low Risk, 1 = High Risk
})

X = data[['market_volatility', 'liquidity', 'historical_returns']]
y = data['risk_category']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier()
model.fit(X_train, y_train)

joblib.dump(model, "risk_model.pkl")

def predict_risk(market_volatility, liquidity, historical_returns):
    model = joblib.load("risk_model.pkl")
    return model.predict([[market_volatility, liquidity, historical_returns]])[0]

if _name_ == "_main_":
    print("Risk Prediction:", predict_risk(0.3, 0.7, 0.5))
