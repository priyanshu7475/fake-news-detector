import joblib
vectorizer = joblib.load('model/vectorizer.pkl')
model = joblib.load('model/model.pkl')
import re
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords', quiet=True)

STOPWORDS = set(stopwords.words('english'))

def clean(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)

    words = text.split()

    words = [word for word in words if word not in STOPWORDS]

    return " ".join(words)

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Flask working!"
@app.route('/health')
def health():
    return jsonify({'status': 'ok'})
@app.route('/predict', methods=['POST'])
def predict():

    data = request.get_json()

    text = data.get('text', '').strip()

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    cleaned = clean(text)

    vec = vectorizer.transform([cleaned])

    prediction = int(model.predict(vec)[0])

    probabilities = model.predict_proba(vec)[0]

    confidence = round(float(max(probabilities)) * 100, 1)

    return jsonify({
        'label': 'Real' if prediction == 1 else 'Fake',
        'confidence': confidence,
        'real_prob': round(float(probabilities[1]) * 100, 1),
        'fake_prob': round(float(probabilities[0]) * 100, 1)
    })
if __name__ == '__main__':
    app.run(debug=True)