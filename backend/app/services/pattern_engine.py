import pandas as pd
import numpy as np

def compute_rsi(series, period=14):
    delta = series.diff()
    gain = delta.clip(lower=0)
    loss = (-delta).clip(lower=0)
    avg_gain = gain.rolling(period).mean()
    avg_loss = loss.rolling(period).mean()
    rs = avg_gain / (avg_loss + 1e-9)
    return 100 - (100 / (1 + rs))


def detect_breakout(df):
    if len(df) < 30: 
        return None
    recent = df.tail(30)
    resistance = recent["high"].iloc[:-1].max()
    last_close = recent["close"].iloc[-1]

    if last_close > resistance * 1.01:
        conf = min(1.0, (last_close / resistance - 1) * 10)
        return conf
    return None


def detect_rsi_divergence(df):
    if len(df) < 40:
        return None
    rsi = compute_rsi(df["close"])
    df["rsi"] = rsi

    last = df.tail(20)

    price_prev = last["close"].iloc[-10]
    price_now = last["close"].iloc[-1]
    rsi_prev = last["rsi"].iloc[-10]
    rsi_now = last["rsi"].iloc[-1]

    if price_now > price_prev * 1.01 and rsi_now < rsi_prev - 2:
        return 0.7
    if price_now < price_prev * 0.99 and rsi_now > rsi_prev + 2:
        return 0.7
    return None


def detect_volume_spike(df):
    if len(df) < 20: return None
    last = df["volume"].iloc[-1]
    avg = df["volume"].iloc[-20:-1].mean()
    if last > avg * 2:
        return min(1.0, last / (avg * 2))
    return None


def detect_golden_cross(df):
    if len(df) < 200:
        return None

    df["sma50"] = df["close"].rolling(50).mean()
    df["sma200"] = df["close"].rolling(200).mean()

    prev = df.iloc[-2]
    curr = df.iloc[-1]

    if prev["sma50"] < prev["sma200"] and curr["sma50"] > curr["sma200"]:
        return 0.8

    return None


def analyze_patterns(symbol, df):
    patterns = []

    if (c := detect_breakout(df)): patterns.append({"type": "BREAKOUT", "confidence": float(c)})
    if (c := detect_rsi_divergence(df)): patterns.append({"type": "RSI_DIVERGENCE", "confidence": float(c)})
    if (c := detect_volume_spike(df)): patterns.append({"type": "VOLUME_SPIKE", "confidence": float(c)})
    if (c := detect_golden_cross(df)): patterns.append({"type": "SMA_GOLDEN_CROSS", "confidence": float(c)})

    return {
        "symbol": symbol,
        "patterns": patterns
    }
