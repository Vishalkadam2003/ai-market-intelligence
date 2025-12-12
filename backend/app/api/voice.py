from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import re

from app.services.indicators import get_history_and_indicators
from app.services.news import fetch_company_news
from app.services.sentiment import analyze_sentiment
from app.services.intelligence import ai_trading_brain

router = APIRouter()

class VoiceRequest(BaseModel):
    text: str

def extract_symbol(text: str) -> Optional[str]:
    """
    Simple symbol extractor:
    1) Check for known Indian largecaps in the sentence
    2) Fallback: uppercase tokens length 2-6
    """
    t = text.upper()

    # You can add more here
    known_symbols = ["TCS", "INFY", "HDFCBANK", "RELIANCE", "ICICIBANK", "SBIN"]

    for sym in known_symbols:
        if sym in t.split() or f" {sym} " in f" {t} ":
            return sym

    # fallback: uppercase words that look like tickers
    tokens = re.findall(r"\b[A-Z]{2,6}\b", t)
    if tokens:
        return tokens[0]

    return None

def explain_indicators(inds: list) -> str:
    """Create a human-readable summary from indicators dataframe (as list of dicts)."""
    if not inds or isinstance(inds, dict) and "error" in inds:
        return "I don't have enough price history to compute indicators for this stock."

    last = inds[-1]
    close = last.get("close")
    sma20 = last.get("SMA20")
    sma50 = last.get("SMA50")
    rsi = last.get("RSI14")
    macd = last.get("MACD")
    signal = last.get("Signal")

    parts = []

    if close and sma20:
        if close > sma20:
            parts.append("Price is trading above the 20-day moving average (short-term uptrend).")
        else:
            parts.append("Price is trading below the 20-day moving average (short-term weakness).")

    if sma20 and sma50:
        if sma20 > sma50:
            parts.append("20-day MA is above 50-day MA — medium-term momentum is bullish.")
        else:
            parts.append("20-day MA is below 50-day MA — medium-term trend looks weak or sideways.")

    if rsi is not None:
        if rsi > 70:
            parts.append(f"RSI is around {rsi:.1f}, which is overbought — risk of a pullback.")
        elif rsi < 30:
            parts.append(f"RSI is around {rsi:.1f}, which is oversold — potential rebound zone.")
        else:
            parts.append(f"RSI is around {rsi:.1f}, which is in a neutral zone.")

    if macd is not None and signal is not None:
        if macd > signal:
            parts.append("MACD is above its signal line — momentum is bullish.")
        else:
            parts.append("MACD is below its signal line — momentum is bearish or cooling off.")

    if not parts:
        return "I couldn't derive a clear signal from the indicators, data might be limited."

    return " ".join(parts)

def summarize_sentiment(news_list):
    if not news_list:
        return "I couldn't find recent news for this stock."

    scores = [n["sentiment_score"] for n in news_list if n.get("sentiment_score") is not None]
    if not scores:
        return "Recent news is available but sentiment couldn't be calculated."

    avg = sum(scores) / len(scores)

    if avg >= 0.05:
        mood = "overall positive"
    elif avg <= -0.05:
        mood = "overall negative"
    else:
        mood = "mixed / neutral"

    return f"News sentiment over recent articles is {mood} with an average VADER score around {avg:.3f}."

def answer_concept_question(text: str) -> Optional[str]:
    """
    Very simple FAQ for common trading terms.
    If question matches, return explanation string, else None.
    """
    t = text.lower()

    if "what is rsi" in t or "rsi" in t and "what" in t:
        return (
            "RSI (Relative Strength Index) is a momentum oscillator from 0 to 100. "
            "Above 70 is considered overbought, below 30 oversold. It measures the strength of recent gains vs losses."
        )
    if "what is macd" in t or "macd" in t and "what" in t:
        return (
            "MACD (Moving Average Convergence Divergence) compares two EMAs, usually 12 and 26 period, "
            "and uses a 9-period signal line. Crossovers give bullish or bearish momentum signals."
        )
    if "what is sma" in t or "simple moving average" in t:
        return (
            "SMA or Simple Moving Average is just the average closing price over a fixed number of days, "
            "like 20-day or 50-day. It helps smooth price and show trend direction."
        )
    if "what is sip" in t:
        return (
            "SIP stands for Systematic Investment Plan. You invest a fixed amount regularly, like monthly, "
            "into a mutual fund or ETF, to average out the buying price over time."
        )
    if "what is intraday" in t:
        return (
            "Intraday trading means you buy and sell within the same trading day, without carrying positions overnight."
        )
    if "what is swing trading" in t or "swing trade" in t:
        return (
            "Swing trading is a style where you hold positions for a few days to a few weeks, "
            "trying to capture short to medium term price swings."
        )

    return None

@router.post("/voice")
def voice_assistant(request: VoiceRequest):
    text = request.text.strip()

    if not text:
        return {
            "reply": "I didn't catch anything. Please say something like 'Analyze TCS' or 'What is RSI?'."
        }

    # 1) Handle greetings / casual talk
    lower = text.lower()
    if any(g in lower for g in ["hi", "hello", "hey", "good morning", "good evening"]):
        # Also try to see if they mentioned a stock in same sentence
        sym = extract_symbol(text)
        if sym:
            # Fall through to analysis path later
            pass
        else:
            return {
                "reply": (
                    "Hi! I'm your AI Market Intelligence assistant. "
                    "You can ask things like 'Analyze TCS', "
                    "'Give me trading view on INFY', or 'What is RSI?'."
                )
            }

    # 2) Handle concept / general questions (no symbol needed)
    concept_answer = answer_concept_question(text)
    if concept_answer:
        sent = analyze_sentiment(text)
        return {
            "mode": "education",
            "question": text,
            "explanation": concept_answer,
            "sentiment": sent,
            "note": "This is educational information, not investment advice."
        }

    # 3) Try to extract symbol for trading analysis
    symbol = extract_symbol(text)
    if not symbol:
        sent = analyze_sentiment(text)
        return {
            "mode": "no_symbol",
            "reply": (
                "I didn't detect any stock symbol. "
                "Please mention a stock like TCS, INFY, HDFCBANK etc. "
                "For example: 'Give me trading view on TCS'."
            ),
            "sentiment": sent
        }

    # 4) Get indicators + history
    data = get_history_and_indicators(symbol)
    if isinstance(data, dict) and "error" in data:
        return {
            "mode": "error",
            "symbol": symbol,
            "error": data["error"]
        }

    indicators = data["indicators"]

    # 5) Get news & sentiment
    news = fetch_company_news(symbol)
    news_summary = summarize_sentiment(news)

    # 6) Build explanation from indicators + sentiment
    indicator_view = explain_indicators(indicators)

    sent_query = analyze_sentiment(text)

    ai_opinion = ai_trading_brain(indicators, sum([n["sentiment_score"] for n in news]) / len(news))

    reply = (
        f"Here is an analytical view on {symbol}.\n\n"
        f"Technical picture: {indicator_view}\n\n"
        f"AI Interpretation: {ai_opinion}\n\n"
        f"News & sentiment: {news_summary}\n\n"
        "This is not a buy or sell recommendation, only an analytical summary."
    )

    return {
        "mode": "symbol_analysis",
        "symbol": symbol,
        "user_query": text,
        "technical_view": indicator_view,
        "news_summary": news_summary,
        "reply": reply,
        "query_sentiment": sent_query,
    }
