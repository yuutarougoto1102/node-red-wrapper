const http = require('http');

const TARGET_URL = 'http://node-red:1880/nodes';
const PORT = 3000; // このNode.jsサーバーがリッスンするポート

// HTTPサーバーを作成
const server = http.createServer((req, res) => {
    // リクエストのパスがルート（/）の場合に処理を実行
    if (req.url === '/') {
        console.log(`Sending HTTP request to: ${TARGET_URL}`);

        // HTTPリクエストのオプション
        const options = {
            method: 'GET', // GETリクエスト
            headers: {
                'Accept': 'application/json' // ヘッダーにAccept: application/jsonを設定
            }
        };

        // ターゲットURLへのHTTPリクエストを送信
        const clientReq = http.request(TARGET_URL, options, (clientRes) => {
            let data = '';

            // レスポンスデータを受信
            clientRes.on('data', (chunk) => {
                data += chunk;
            });

            // レスポンスデータがすべて受信された時
            clientRes.on('end', () => {
                console.log('HTTP response received.');
                console.log('Response status:', clientRes.statusCode);
                console.log('Response data:', data);

                // Webページとしてレスポンスを返す
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.write('<!DOCTYPE html>');
                res.write('<html lang="ja">');
                res.write('<head>');
                res.write('<meta charset="UTF-8">');
                res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
                res.write('<title>HTTP Request Result</title>');
                res.write('</head>');
                res.write('<body>');
                res.write('<h1>HTTP Request Result</h1>');
                res.write('<h2>Request Details:</h2>');
                res.write(`<p><strong>Target URL:</strong> ${TARGET_URL}</p>`);
                res.write(`<p><strong>Method:</strong> ${options.method}</p>`);
                res.write(`<p><strong>Headers:</strong> ${JSON.stringify(options.headers)}</p>`);
                res.write('<h2>Response:</h2>');
                res.write(`<p><strong>Status Code:</strong> ${clientRes.statusCode}</p>`);
                res.write('<pre><code>');
                try {
                    // JSONとして整形して表示を試みる
                    res.write(JSON.stringify(JSON.parse(data), null, 2));
                } catch (e) {
                    // JSONではない場合はそのまま表示
                    res.write(data);
                }
                res.write('</code></pre>');
                res.write('</body>');
                res.write('</html>');
                res.end();
            });
        });

        // リクエスト送信中のエラーをハンドル
        clientReq.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write('<h1>Error during HTTP Request</h1>');
            res.write(`<p>Could not reach ${TARGET_URL} or an error occurred.</p>`);
            res.write(`<p>Error: ${e.message}</p>`);
            res.end();
        });

        // リクエストを終了（GETリクエストでは通常データ送信は不要）
        clientReq.end();

    } else {
        // ルート以外のパスへのリクエストは404を返す
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 Not Found</h1>');
    }
});

// サーバーを指定されたポートでリッスン開始
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Access http://localhost:${PORT}/ in your browser to see the HTTP request result.`);
});