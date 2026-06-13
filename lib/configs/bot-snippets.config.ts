export type SnippetLanguage = 'curl' | 'node' | 'python' | 'go';

export const SNIPPET_LANGUAGES: { value: SnippetLanguage; label: string }[] = [
  { value: 'curl', label: 'cURL' },
  { value: 'node', label: 'Node' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
];

export function getBotSnippets(params: {
  botId: string;
  apiKey: string;
  exchangeSlug: string;
  pair: string;
  timestamp: string;
}): Record<SnippetLanguage, string> {
  const { botId, apiKey, exchangeSlug, pair, timestamp } = params;

  return {
    curl: `curl -X POST https://marcus-api.tromoi.xyz/api/v1/signals \\
  -H "X-Marcus-Api-Key: ${apiKey}" \\
  -H "X-Marcus-Bot-Secret: <YOUR_SECRET>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signalId": "sig_${botId}",
    "botId": "${botId}",
    "exchangeSlug": "${exchangeSlug}",
    "symbol": "${pair}",
    "action": "OPEN_LONG",
    "price": 67321.12,
    "timestamp": "${timestamp}"
  }'`,
    node: `const axios = require('axios');

const payload = {
  signalId: "sig_${botId}",
  botId: "${botId}",
  exchangeSlug: "${exchangeSlug}",
  symbol: "${pair}",
  action: "OPEN_LONG",
  price: 67321.12,
  timestamp: "${timestamp}"
};

axios.post('https://marcus-api.tromoi.xyz/api/v1/signals', payload, {
  headers: {
    'X-Marcus-Api-Key': '${apiKey}',
    'X-Marcus-Bot-Secret': '<YOUR_SECRET>',
    'Content-Type': 'application/json'
  }
})
.then((res) => console.log('Signal sent:', res.status))
.catch((err) => console.error('Error:', err.message));`,
    python: `import requests
from datetime import datetime

payload = {
    "signalId": "sig_${botId}",
    "botId": "${botId}",
    "exchangeSlug": "${exchangeSlug}",
    "symbol": "${pair}",
    "action": "OPEN_LONG",
    "price": 67321.12,
    "timestamp": datetime.utcnow().isoformat() + "Z"
}

headers = {
    "X-Marcus-Api-Key": "${apiKey}",
    "X-Marcus-Bot-Secret": "<YOUR_SECRET>",
    "Content-Type": "application/json"
}

response = requests.post(
    "https://marcus-api.tromoi.xyz/api/v1/signals",
    json=payload,
    headers=headers
)
print("Status code:", response.status_code)
print("Response:", response.text)`,
    go: `package main

import (
\t"bytes"
\t"encoding/json"
\t"fmt"
\t"net/http"
\t"time"
)

func main() {
\tpayload := map[string]interface{}{
\t\t"signalId":     fmt.Sprintf("sig_%d", time.Now().Unix()),
\t\t"botId":        "${botId}",
\t\t"exchangeSlug": "${exchangeSlug}",
\t\t"symbol":       "${pair}",
\t\t"action":       "OPEN_LONG",
\t\t"price":        67321.12,
\t\t"timestamp":    time.Now().UTC().Format(time.RFC3339),
\t}

\tjsonValue, _ := json.Marshal(payload)
\treq, _ := http.NewRequest("POST", "https://marcus-api.tromoi.xyz/api/v1/signals", bytes.NewBuffer(jsonValue))

\treq.Header.Set("X-Marcus-Api-Key", "${apiKey}")
\treq.Header.Set("X-Marcus-Bot-Secret", "<YOUR_SECRET>")
\treq.Header.Set("Content-Type", "application/json")

\tclient := &http.Client{}
\tresp, err := client.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()

\tfmt.Println("Response Status:", resp.Status)
}`,
  };
}
