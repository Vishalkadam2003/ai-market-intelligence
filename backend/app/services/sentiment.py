from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

def analyze_sentiment(text: str):
    scores = analyzer.polarity_scores(text)
    score = scores["compound"]

    if score >= 0.05:
        label = "POSITIVE"
    elif score <= -0.05:
        label = "NEGATIVE"
    else:
        label = "NEUTRAL"

    return {
        "sentiment_score": score,
        "sentiment_label": label
    }
