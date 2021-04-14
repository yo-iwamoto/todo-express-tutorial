## ExpressでTODOリストのAPIサーバーを作成したリポジトリです
Expressを利用して，JWTでのトークン管理，MySQLでのデータ永続化などを行います．

ライブラリ，ミドルウェア等の利用は最小限に留め，基本的にはスクラッチで実装しています．

モジュールバンドルはWebpack，コンパイルはtscで行っています．

## 未実装項目（2021.3.26 - 02:21時点）
### 認証
  - access-tokenにexpireを設定
### TODOリスト
  - TodoItemクラス等の定義
  - TodoItem API
  - Userとの紐付け
  - 認証時のレスポンスにTodoItemを載せる
