#!/usr/bin/env bash
set -euo pipefail

# ---------- インプット ----------
ALIAS="渋谷CYL"                     # 会場別名
GROUP_ID=1                          # groups.id
EVENT_DATE="2025-06-14"             # YYYY-MM-DD
START_TIME="19:00"                  # HH:MM 24h
TITLE="ワンマンライブ"                # 告知タイトル
TWEET_ID="1790123456789012345"      # 19桁 / 無ければ空
# ------------------------------------------------------------------

api="${BE_BEE_NEXT_POTAL_SUPABASE_URL}/rest/v1"
key="$BE_BEE_NEXT_POTAL_SUPABASE_SECRET"
hdr=(-H "apikey: $key" -H "Authorization: Bearer $key")

# == STEP-1 : alias 検索 =================================================
alias_id=$(curl -s "${api}/venue_aliases?alias=eq.${ALIAS}&select=id&limit=1" \
           "${hdr[@]}" | jq -r '.[0].id // empty')

# == STEP-2 : 無ければ INSERT ============================================
if [[ -z "$alias_id" ]]; then
  alias_id=$(curl -s -X POST "${api}/venue_aliases?select=id" \
               "${hdr[@]}" -H 'Content-Type: application/json' \
               -d "{\"alias\":\"${ALIAS}\"}" \
             | jq -r '.[0].id')
  new_alias="yes"
fi
echo "alias_id=$alias_id"

# == STEP-3 : events UPSERT =============================================
event_json=$(curl -s -X POST \
  "${api}/events?on_conflict=group_id,venue_alias_id,event_date,start_time" \
  "${hdr[@]}" -H 'Prefer: resolution=merge-duplicates,return=representation' \
  -H 'Content-Type: application/json' \
  -d "{
        \"group_id\":       ${GROUP_ID},
        \"venue_alias_id\": ${alias_id},
        \"event_date\":     \"${EVENT_DATE}\",
        \"start_time\":     \"${START_TIME}\",
        \"title\":          \"${TITLE//\"/\\\"}\",
        \"tweet_id\":       ${TWEET_ID:-null}
      }")

event_id=$(echo "$event_json" | jq -r '.[0].id')
echo "events id=$event_id"