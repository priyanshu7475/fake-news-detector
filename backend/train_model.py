import pandas as pd
import os
print(os.listdir())
real=pd.read_csv('News_Dataset/True.csv')
fake=pd.read_csv('News_Dataset/Fake.csv')
real['label'] = 1   # 1 = real
fake['label'] = 0   # 0 = fake
df = pd.concat([real, fake], ignore_index=True)
print(df.shape)          # (44898, 5)
print(df['label'].value_counts())
print(df['text'].iloc[0])  # look at a sample

import re
import nltk
import joblib

from nltk.corpus import stopwords

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score

nltk.download('stopwords')
stopwords.words('english')

STOPWORDS = set(stopwords.words('english'))
STOPWORDS = set(stopwords.words('english'))

def clean_text(text):
    text = text.lower()

    # remove special characters
    text = re.sub(r'[^a-z\s]', '', text)

    # tokenize
    words = text.split()

    # remove stopwords
    words = [word for word in words if word not in STOPWORDS]

    return " ".join(words)

df['clean_text'] = df['text'].fillna('').apply(clean_text)

X = df['clean_text']
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

vectorizer = TfidfVectorizer(
    max_features=50000,
    ngram_range=(1,2)
)

X_train_vec = vectorizer.fit_transform(X_train)

X_test_vec = vectorizer.transform(X_test)

model = MultinomialNB()

model.fit(X_train_vec, y_train)

predictions = model.predict(X_test_vec)

print("Accuracy:", accuracy_score(y_test, predictions))

print(classification_report(y_test, predictions))

joblib.dump(model, 'model.pkl')

joblib.dump(vectorizer, 'vectorizer.pkl')