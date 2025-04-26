#!/usr/bin/env bash
# ============================================================================
# fetch_groups.sh
#
# Supabase から groups の id と x_user_name を取得し、
# 「<id> <プロフィールURL>」形式で stdout に出力する。
#
# 出力例:
#   1 https://x.com/THE_BETH_JP
#   2 https://x.com/GroupB_live
# ============================================================================

set -euo pipefail

# 環境変数 BE_BEE_NEXT_PORTAL_SUPABASE_URL と BE_BEE_NEXT_PORTAL_SUPABASE_SECRET は シークレットストアに登録済み
api="${BE_BEE_NEXT_POTAL_SUPABASE_URL}/rest/v1"
key="${BE_BEE_NEXT_POTAL_SUPABASE_SECRET}"

curl -s "${api}/groups?select=id,x_user_name" \
  -H "apikey: $key" \
  -H "Authorization: Bearer $key" |
jq -r '.[] | "\(.id) https://x.com/\(.x_user_name)"'
