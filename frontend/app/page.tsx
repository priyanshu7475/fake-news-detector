'use client';

import { useState } from 'react';

interface DetectionResult {
  confidence?: number;
  prediction?: number;
  label?: string;
  [key: string]: any;
}

export default function FakeNewsDetector() {
  const [newsText, setNewsText] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!newsText.trim()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://fake-news-backend-qrs5.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newsText }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[v0] API Response:', data);
      
      setResult(data);
    } catch (err) {
      console.error('[v0] Error calling API:', err);
      setError('Failed to analyze news. Make sure your API endpoint is running at http://localhost:5000/predict');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceValue = (): number => {
  if (!result) return 0;
  if (result.confidence !== undefined) {
    return typeof result.confidence === 'number'
      ? result.confidence
      : parseFloat(result.confidence);
  }
  return 0;
};

const getStatusLabel = (confidence: number): string => {
  if (result?.label === 'Fake') return 'Likely Fake News';
  if (result?.label === 'Real') return 'Likely Real News';
  return 'Uncertain';
};

const getStatusType = (confidence: number): 'fake' | 'uncertain' | 'real' => {
  if (result?.label === 'Fake') return 'fake';
  if (result?.label === 'Real') return 'real';
  return 'uncertain';
};

  const confidence = getConfidenceValue();
  const statusLabel = getStatusLabel(confidence);
  const statusType = getStatusType(confidence);

  return (
    <div className="container-main">
      <div className="content-wrapper">
        {/* Header */}
        <div className="header-section">
          <h1 className="project-title">TruthChecker</h1>
          <p className="project-subtitle">Advanced AI-Powered Fake News Detection</p>
        </div>

        {/* Main Card */}
        <div className="card">
          {/* Input Section */}
          <div className="input-section">
            <div className="form-group">
              <label className="form-label">Paste News Article or Text</label>
              <textarea
                className="form-input"
                placeholder="Enter the news text you want to analyze for authenticity. Our AI will scan for credibility indicators and suspicious patterns..."
                value={newsText}
                onChange={(e) => setNewsText(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={loading || !newsText.trim()}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span> Analyzing...
                </>
              ) : (
                'Analyze News Credibility'
              )}
            </button>

            {error && <div className="error-message">{error}</div>}
          </div>

          {/* Results Section */}
          {result && (
            <div className="results-section fade-in">
              <h2 className="result-title">Detection Results</h2>

              {/* Confidence Meter */}
              <div className="confidence-meter-container">
                <div className="meter-wrapper">
                  <div
                    className={`meter-circle ${statusType}`}
                    style={{
                      '--meter-rotation': `${((result?.fake_prob ?? 0) / 100) * 180}deg`,
                    } as React.CSSProperties}
                  >
                    <div className="meter-needle"></div>
                  </div>

                  <div className="meter-scale">
                    <div className="scale-label scale-real">REAL</div>
                    <div className="scale-label scale-fake">FAKE</div>
                  </div>
                </div>

                {/* Status Badge and Confidence */}
                <div className="status-info">
                  <div className={`detection-status ${statusType}`}>
                    <span className="status-icon">
                      {statusType === 'real' && '✓'}
                      {statusType === 'fake' && '✕'}
                      {statusType === 'uncertain' && '?'}
                    </span>
                    <span className="status-text">{statusLabel}</span>
                  </div>

                  <div className="confidence-display">
                    <div className="confidence-value" style={{ color: getColorForConfidence(confidence, result?.label || '') }}>
                      {Math.round(confidence)}%
                    </div>
                    <div className="confidence-label">{result?.label} confidence</div>
                  </div>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="confidence-bar-container">
                <div className="bar-labels">
                  <span>Real</span>
                  <span>Uncertain</span>
                  <span>Fake</span>
                </div>
                <div className="confidence-bar-background">
                  <div
                    className={`confidence-bar ${statusType}`}
                    style={{ width: `${result?.fake_prob ?? 0}%` }}
                  ></div>
                </div>
                <div className="bar-range">0% — 100%</div>
              </div>

              {/* Additional Details */}
              <div className="analysis-details">
  <div className="detail-item">
    <span className="detail-label">Verdict</span>
    <span className="detail-value">{result?.label}</span>
  </div>
  <div className="detail-item">
    <span className="detail-label">Real probability</span>
    <span className="detail-value">{result?.real_prob}%</span>
  </div>
  <div className="detail-item">
    <span className="detail-label">Fake probability</span>
    <span className="detail-value">{result?.fake_prob}%</span>
  </div>
  <div className="detail-item">
    <span className="detail-label">Confidence level</span>
    <span className="detail-value">
      {confidence > 85 ? 'Very High' : confidence > 65 ? 'High' : confidence > 35 ? 'Medium' : 'Low'}
    </span>
  </div>
</div>
            </div>
          )}
        </div>

        {/* Info Text */}
        {!result && (
          <p className="info-text">
            This tool uses advanced AI analysis to detect potential misinformation patterns.
            <br />
            Higher percentage indicates more suspicious content characteristics.
          </p>
        )}
      </div>
    </div>
  );
}

function getColorForConfidence(confidence: number, label: string): string {
  if (label === 'Fake') return '#ef4444';
  if (label === 'Real') return '#10b981';
  return '#fbbf24';
}
