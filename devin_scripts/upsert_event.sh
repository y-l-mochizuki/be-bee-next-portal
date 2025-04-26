#!/usr/bin/env bash
set -euo pipefail
# ============================================================================
# 使い方（すべて必須オプション）:
#   ./upsert_event.sh \
#     --alias      "渋谷CYL" \
#     --group_id   1 \
#     --date       2025-06-14 \
#     --time       19:00 \
#     --title      "ワンマンライブ" \
#     --tweet_id   1790123456789012345
#
# ※環境変数 BE_BEE_NEXT_PORTAL_SUPABASE_URL と BE_BEE_NEXT_PORTAL_SUPABASE_SECRET は シークレットストアに登録済み
# ============================================================================

# ────────── 1. 使い方関数 ───────────────────
usage() {
  cat <<EOF
Usage: $0 \\
  -a <alias>        # 会場別名 (例: 渋谷CYL)           ※必須
  -g <group_id>     # groups.id (例: 1)              ※必須
  -d <yyyy-mm-dd>   # 開催日  (例: 2025-06-14)        ※必須
  -t <hh:mm>        # 開始時刻 (例: 19:00)            ※必須
  -T <title>        # タイトル (例: ワンマンライブ)     ※必須
  -i <tweet_id>     # tweet_id 19桁 (例: 1790…)      ※必須
  -h                # ヘルプ
EOF
  exit 1
}

# ────────── 2. 引数パース ──────────────────
while getopts "a:g:d:t:T:i:h" opt; do
  case "$opt" in
    a) ALIAS="$OPTARG"       ;;
    g) GROUP_ID="$OPTARG"    ;;
    d) EVENT_DATE="$OPTARG"  ;;
    t) START_TIME="$OPTARG"  ;;
    T) TITLE="$OPTARG"       ;;
    i) TWEET_ID="$OPTARG"    ;;
    h|*) usage ;;
  esac
done

# 必須チェック（どれか欠けたら usage を表示）
[[ -z "${ALIAS:-}"      ||
   -z "${GROUP_ID:-}"   ||
   -z "${EVENT_DATE:-}" ||
   -z "${START_TIME:-}" ||
   -z "${TITLE:-}"      ||
   -z "${TWEET_ID:-}"   ]] && usage

# ────────── 3. API 共通設定 ────────────────
api="${BE_BEE_NEXT_PORTAL_SUPABASE_URL}/rest/v1"
key="${BE_BEE_NEXT_PORTAL_SUPABASE_SECRET}"
hdr=(-H "apikey: $key" -H "Authorization: Bearer $key")

# ────────── 4. alias 検索 or 挿入 ───────────
encoded_alias=$(echo "$ALIAS" | jq -sRr @uri)
alias_id=$(curl -s "${api}/venue_aliases?alias=eq.${encoded_alias}&select=id&limit=1" \
           "${hdr[@]}" | jq -r '.[0].id // empty')

if [[ -z "$alias_id" ]]; then
  alias_id=$(curl -s -X POST "${api}/venue_aliases?select=id" \
               "${hdr[@]}" -H 'Content-Type: application/json' \
               -d "{\"alias\":\"${ALIAS}\"}" \
             | jq -r '.[0].id')
  echo ":new: alias '${ALIAS}' added (id=${alias_id})"
fi

# ────────── 5. events UPSERT ───────────────
event_payload=$(jq -n \
  --arg gid "$GROUP_ID" \
  --arg aid "$alias_id" \
  --arg ed  "$EVENT_DATE" \
  --arg st  "$START_TIME" \
  --arg tt  "$TITLE" \
  --arg tw  "$TWEET_ID" \
  '{
     group_id:       ($gid|tonumber),
     venue_alias_id: ($aid|tonumber),
     event_date:     $ed,
     start_time:     $st,
     title:          $tt,
     tweet_id:       $tw
   }')

event_id=$(curl -s -X POST \
  "${api}/events?on_conflict=group_id,venue_alias_id,event_date,start_time&select=id" \
  "${hdr[@]}" -H 'Prefer: resolution=merge-duplicates,return=representation' \
  -H 'Content-Type: application/json' \
  -d "$event_payload" | jq -r '.[0].id // empty')

[[ -z "$event_id" ]] && { echo "❌ Event upsert failed"; exit 1; }

echo "✔︎ events upserted: id=${event_id}"
