
from textblob import TextBlob


def analyze_sentiment(text: str):
    """
    Analyze student feedback and determine
    whether the sentiment is positive, negative,
    or neutral.
    """

    blob = TextBlob(text)

    polarity = blob.sentiment.polarity

    if polarity > 0.1:
        sentiment = "Positive"

    elif polarity < -0.1:
        sentiment = "Negative"

    else:
        sentiment = "Neutral"

    return {
        "sentiment": sentiment,
        "sentiment_score": round(polarity, 3),
        "explanation": (
            f"The feedback expresses {sentiment.lower()} "
            f"sentiment with a polarity score of "
            f"{round(polarity, 3)}."
        )
    }
