# TruthChecker — Fake News Detector

A full-stack web application that uses Machine Learning to classify news articles as real or fake.

![TruthChecker](https://fake-news-detector-tau-virid.vercel.app/)

## Live Demo
🔗 [https://fake-news-detector-tau-virid.vercel.app/](https://fake-news-detector-tau-virid.vercel.app/)

---

## What it does
Paste any news article or headline into the input box. The app sends it to an ML model which returns:
- A **verdict** — Real or Fake
- A **confidence score** — how certain the model is
- **Real and Fake probabilities** — breakdown of the prediction

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, CSS |
| Backend | Python, Flask, Flask-CORS |
| ML Model | Scikit-learn (TF-IDF + Naive Bayes) |
| Dataset | ISOT Fake News Dataset (44,898 articles) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Model Performance

| Metric | Score |
|---|---|
| Accuracy | 0.96% |
| Dataset | ISOT (21k real + 23k fake articles) |
| Algorithm | Multinomial Naive Bayes + TF-IDF |
| Inference | ~11ms per prediction |

---

## Project Structure

```
fake-news-detector/
├── backend/
│   ├── app.py               # Flask API server
│   ├── train_model.py       # Model training script
│   ├── requirements.txt     # Python dependencies
│   └── model/
│       ├── model.pkl        # Trained Naive Bayes classifier
│       └── vectorizer.pkl   # Fitted TF-IDF vectorizer
└── frontend/
    ├── app/
    │   ├── page.tsx         # Main React component
    │   └── layout.tsx       # Next.js layout
    └── styles/              # CSS styles
```

---

## Run Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
python train_model.py        # Train and save the model (run once)
python app.py                # Start Flask server on port 5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                  # Start Next.js on port 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Reference

### POST `/predict`

**Request**
```json
{
  "text": "your news article text here"
}
```

**Response**
```json
{
  "label": "Real",
  "confidence": 94.0,
  "real_prob": 94.0,
  "fake_prob": 6.0
}
```

### GET `/health`
Returns `{"status": "ok"}` if the server is running.

---

## How it works

1. User pastes a news article into the frontend
2. React sends a POST request to the Flask API
3. Flask cleans the text (lowercase, remove stopwords)
4. TF-IDF vectorizer converts text to a feature vector
5. Naive Bayes classifier predicts Real or Fake
6. Confidence scores are returned and displayed on the UI

---

## Dataset

The model is trained on the [ISOT Fake News Dataset](https://www.kaggle.com/datasets/csmalarkodi/isot-fake-news-dataset) which contains:
- **21,417** real news articles (sourced from Reuters)
- **23,481** fake news articles

> ⚠️ Note: This tool is for educational purposes. Always verify news from multiple trusted sources.

---

## Author

**Priyanshu Kumar**
- GitHub: [@priyanshu7475](https://github.com/priyanshu7475)
- LinkedIn: [linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)
