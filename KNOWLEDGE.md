# KNOWLEDGE

プロジェクト運用で得た知見をまとめる。

---

## GitHub Actions: アクションのコミットハッシュ固定

### なぜハッシュで固定するか

`uses: actions/checkout@v5` のようなタグ指定は mutable（上書き可能）なため、タグを書き換えることでサプライチェーン攻撃が成立する。
コミットハッシュで固定することでこのリスクを排除できる。

参考: [axios ソフトウェアサプライチェーン攻撃の概要と対応指針 - GMO Flatt Security Blog](https://blog.flatt.tech/entry/axios_compromise)

### ハッシュの取得方法

```bash
# タグに対応するコミット SHA を1件ずつ取得する（必ず1件ずつ実行する）
gh api repos/actions/checkout/commits/v5.0.1 --jq '.sha'
gh api repos/actions/setup-node/commits/v5.0.0 --jq '.sha'
```

**注意: `&` による並列実行は出力順序が保証されないため使わない。**
複数を一度に取得したい場合は `echo "ラベル: $(コマンド)"` の形で識別子をつける。

```bash
# OK: ラベル付きで順次実行
echo "checkout: $(gh api repos/actions/checkout/commits/v5.0.1 --jq '.sha')"
echo "setup-node: $(gh api repos/actions/setup-node/commits/v5.0.0 --jq '.sha')"
```

### ハッシュの検証方法

取得したSHAが正しいか、以下のいずれかで確認する。

```bash
# タグ一覧から逆引きして照合
gh api repos/actions/checkout/git/refs/tags --jq '.[] | select(.ref | test("refs/tags/v5\\.")) | .ref + " -> " + .object.sha'

# または git ls-remote（GitHub アカウント不要）
git ls-remote https://github.com/actions/checkout refs/tags/v5.0.1
```

GitHub UI: `https://github.com/{owner}/{repo}/releases/tag/{version}`

### deploy.yml での書き方

バージョンとリリース URL をコメントで明記して根拠を残す。

```yaml
- uses: actions/checkout@93cb6efe18208431cddfb8368fd83d5badbf9bfd  # v5.0.1 https://github.com/actions/checkout/releases/tag/v5.0.1
```

Dependabot を有効にしておくと、ハッシュ指定でも新バージョンが出たときに自動でPRを作ってくれる（コメントのバージョン番号を手がかりに検出する）。

### pinact を使った自動化

手動取得は順序の入れ違いなどミスが起きやすい。[pinact](https://github.com/suzuki-shunsuke/pinact) を使うと同じ GitHub API をツールが叩いてくれるので、ミスなく自動でハッシュ固定できる。

```bash
brew install pinact

# タグ指定をハッシュに一括変換（ワークフローファイルを直接書き換える）
pinact run

# 既存のSHAとコメントのバージョンが一致しているか検証
pinact run --verify

# ハッシュ未固定のアクションがないか確認（ファイルは変更しない）
pinact run --check
```

`--verify` と `--check` がどちらも exit 0（出力なし）であれば問題なし。

#### pinact の仕組み

内部では GitHub REST API（`ListTags` / `GetCommit` / `ListReleases`）を使って、タグ名からコミットSHAを解決している。手動で `gh api repos/{owner}/{repo}/commits/{tag} --jq '.sha'` を叩くのと本質的に同じだが、ワークフローファイルの解析・書き換えまで自動でやってくれる。

#### ハッシュ固定の限界

ハッシュ固定で防げるのは「タグの書き換えによる攻撃」のみ。**タグが最初から悪意のあるコミットを指している場合（tj-actions事件のようなケース）は防げない。** これは「信頼した時点のコードを固定する」という意味であり、そのアクションのメンテナを信頼するかどうかの判断とは別の話。

参考: [GitHub Actions のセキュリティ強化 - pinact を使ったハッシュ固定](https://zenn.dev/kou_pg_0131/articles/gha-should-be-pinned)
