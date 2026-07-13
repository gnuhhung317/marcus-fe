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
    curl: `# cURL requires manual HMAC computation. Below is a bash snippet example:
TIMESTAMP=$(date +%s)000
PAYLOAD='{"action":"OPEN_LONG","botId":"${botId}","exchangeSlug":"${exchangeSlug}","price":67321.12,"signalId":"sig_${botId}_'"$TIMESTAMP"'","symbol":"${pair}","timestamp":"${timestamp}"}'
SIGNATURE=$(echo -n -e "$TIMESTAMP\n$PAYLOAD" | openssl dgst -sha256 -hmac "<YOUR_SECRET>" -hex | cut -d' ' -f2)

curl -X POST https://marcus-api.tromoi.xyz/api/v1/signals \\
  -H "X-Bot-Api-Key: ${apiKey}" \\
  -H "X-Timestamp: $TIMESTAMP" \\
  -H "X-Signature: $SIGNATURE" \\
  -H "Content-Type: application/json" \\
  -d "$PAYLOAD"`,
    node: `const axios = require('axios');
const crypto = require('crypto');

const botId = "${botId}";
const apiKey = "${apiKey}";
const secret = "<YOUR_SECRET>"; // Replace with your Bot Signer Secret

const payload = {
  signalId: \`sig_\${botId}_\${Date.now()}\`,
  botId: botId,
  exchangeSlug: "${exchangeSlug}",
  symbol: "${pair}",
  action: "OPEN_LONG",
  price: 67321.12,
  timestamp: "${timestamp}"
};

// Sort keys and format compactly to ensure canonical JSON structure
const canonicalPayload = JSON.stringify(payload, Object.keys(payload).sort());
const timestampHeader = Date.now().toString();

const message = \`\${timestampHeader}\\n\${canonicalPayload}\`;
const signature = crypto
  .createHmac('sha256', secret)
  .update(message)
  .digest('hex');

axios.post('https://marcus-api.tromoi.xyz/api/v1/signals', payload, {
  headers: {
    'X-Bot-Api-Key': apiKey,
    'X-Timestamp': timestampHeader,
    'X-Signature': signature,
    'Content-Type': 'application/json'
  }
})
.then((res) => console.log('Signal sent:', res.status))
.catch((err) => console.error('Error:', err.message));`,
    python: `import requests
import time
import json
import hmac
import hashlib

bot_id = "${botId}"
api_key = "${apiKey}"
secret = "<YOUR_SECRET>"  # Replace with your Bot Signer Secret

payload = {
    "signalId": f"sig_{bot_id}_{int(time.time())}",
    "botId": bot_id,
    "exchangeSlug": "${exchangeSlug}",
    "symbol": "${pair}",
    "action": "OPEN_LONG",
    "price": 67321.12,
    "timestamp": "${timestamp}"
}

# Canonicalize JSON (sort keys, no spaces in separators)
canonical_payload = json.dumps(payload, sort_keys=True, separators=(",", ":"))
timestamp_header = str(int(time.time() * 1000))

# Compute HMAC-SHA256 signature
message = f"{timestamp_header}\\n{canonical_payload}".encode("utf-8")
signature = hmac.new(secret.encode("utf-8"), message, hashlib.sha256).hexdigest()

headers = {
    "X-Bot-Api-Key": api_key,
    "X-Timestamp": timestamp_header,
    "X-Signature": signature,
    "Content-Type": "application/json"
}

response = requests.post(
    "https://marcus-api.tromoi.xyz/api/v1/signals",
    data=canonical_payload,  # Send raw payload to match signature exactly
    headers=headers
)
print("Status code:", response.status_code)
print("Response:", response.text)`,
    go: `package main

import (
\t"bytes"
\t"crypto/hmac"
\t"crypto/sha256"
\t"encoding/hex"
\t"encoding/json"
\t"fmt"
\t"net/http"
\t"strconv"
\t"time"
)

func main() {
\tbotId := "${botId}"
\tapiKey := "${apiKey}"
\tsecret := "<YOUR_SECRET>" // Replace with your Bot Signer Secret

\tpayload := map[string]interface{}{
\t\t"signalId":     fmt.Sprintf("sig_%s_%d", botId, time.Now().Unix()),
\t\t"botId":        botId,
\t\t"exchangeSlug": "${exchangeSlug}",
\t\t"symbol":       "${pair}",
\t\t"action":       "OPEN_LONG",
\t\t"price":        67321.12,
\t\t"timestamp":    "${timestamp}",
\t}

\t// Go's json.Marshal sorts map keys alphabetically and uses compact format
\tjsonValue, _ := json.Marshal(payload)
\ttimestampHeader := strconv.FormatInt(time.Now().UnixNano()/int64(time.Millisecond), 10)

\t// Compute HMAC-SHA256 signature
\tmessage := []byte(fmt.Sprintf("%s\\n%s", timestampHeader, string(jsonValue)))
\tmac := hmac.New(sha256.New, []byte(secret))
\tmac.Write(message)
\tsignature := hex.EncodeToString(mac.Sum(nil))

\treq, _ := http.NewRequest("POST", "https://marcus-api.tromoi.xyz/api/v1/signals", bytes.NewBuffer(jsonValue))

\treq.Header.Set("X-Bot-Api-Key", apiKey)
\treq.Header.Set("X-Timestamp", timestampHeader)
\treq.Header.Set("X-Signature", signature)
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
