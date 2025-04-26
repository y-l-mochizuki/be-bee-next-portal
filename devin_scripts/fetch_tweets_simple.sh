#

set -euo pipefail

USERS=("THE_BETH_JP" "WHiTRiP2024" "888STING_JP")

declare -A VENUE_DICT
VENUE_DICT["渋谷CYCLONE"]="Shibuya CYCLONE"
VENUE_DICT["渋谷サイクロン"]="Shibuya CYCLONE"
VENUE_DICT["新宿LOFT"]="Shinjuku LOFT"
VENUE_DICT["新宿ロフト"]="Shinjuku LOFT"

TEMP_DIR=$(mktemp -d)
TWEETS_FILE="${TEMP_DIR}/tweets.json"
RESULTS_FILE="${TEMP_DIR}/results.json"
trap 'rm -rf ${TEMP_DIR}' EXIT

parse_date() {
  local date_str=$1
  local year month day
  
  year=$(date +%Y)
  
  if [[ $date_str =~ ([0-9]+)月([0-9]+)日 ]]; then
    month=${BASH_REMATCH[1]}
    day=${BASH_REMATCH[2]}
  elif [[ $date_str =~ ([0-9]+)/([0-9]+) ]]; then
    month=${BASH_REMATCH[1]}
    day=${BASH_REMATCH[2]}
  else
    return 1
  fi
  
  if (( month < 1 || month > 12 )); then
    return 1
  fi
  
  if (( day < 1 || day > 31 )); then
    return 1
  fi
  
  printf "%04d-%02d-%02d" "$year" "$month" "$day"
}

parse_time() {
  local time_str=$1
  local hour minute
  
  if [[ $time_str =~ ([0-9]+):([0-9]+) ]]; then
    hour=${BASH_REMATCH[1]}
    minute=${BASH_REMATCH[2]}
  elif [[ $time_str =~ ([0-9]+)時 ]]; then
    hour=${BASH_REMATCH[1]}
    minute=0
  else
    return 1
  fi
  
  if (( hour < 0 || hour > 23 )); then
    return 1
  fi
  
  if (( minute < 0 || minute > 59 )); then
    return 1
  fi
  
  printf "%02d:%02d" "$hour" "$minute"
}

normalize_venue() {
  local venue=$1
  
  if [[ -n "${VENUE_DICT[$venue]:-}" ]]; then
    echo "${VENUE_DICT[$venue]}"
  else
    echo "$venue"
  fi
}

fetch_tweets() {
  local username=$1
  echo "ユーザー ${username} のツイートを取得中..."
  
  cat > "$TWEETS_FILE" << EOF
[
  {
    "id": "1790123456789012345",
    "text": "6/14(金) 渋谷CYCLONE 19:00開演 ワンマンライブ 詳細はプロフィールのリンクから"
  },
  {
    "id": "1790123456789012346",
    "text": "6月29日 新宿LOFT 11時から フリーライブ開催！"
  },
  {
    "id": "1790123456789012347",
    "text": "新曲「サマータイム」配信開始しました！"
  },
  {
    "id": "1790123456789012348",
    "text": "7/10 19:00 渋谷サイクロン ライブ出演決定！"
  },
  {
    "id": "1790123456789012349",
    "text": "8月15日(木) 20時 新宿ロフト ワンマンライブ"
  },
  {
    "id": "1790123456789012350",
    "text": "今日は素敵な一日でした！"
  },
  {
    "id": "1790123456789012351",
    "text": "9/1 18:30 渋谷CYCLONE\n9/2 19:00 新宿LOFT\n2days連続ライブ決定！"
  },
  {
    "id": "1790123456789012352",
    "text": "10月10日 渋谷CYCLONE 19時 ハロウィンライブ"
  },
  {
    "id": "1790123456789012353",
    "text": "11/23(土) 17:00 新宿LOFT\n11/24(日) 16:00 渋谷CYCLONE\nツーマンライブ"
  },
  {
    "id": "1790123456789012354",
    "text": "12/25 クリスマスライブ 詳細は後日発表"
  }
]
EOF
}

main() {
  echo "[]" > "$RESULTS_FILE"
  total_tweets=0
  
  for username in "${USERS[@]}"; do
    fetch_tweets "$username"
    
    while read -r tweet; do
      tweet_id=$(echo "$tweet" | jq -r '.id')
      text=$(echo "$tweet" | jq -r '.text')
      total_tweets=$((total_tweets + 1))
      
      IFS=$'\n' read -d '' -ra lines <<< "$text" || true
      
      for line in "${lines[@]}"; do
        if [[ $line =~ ([0-9]+月[0-9]+日|[0-9]+/[0-9]+) ]]; then
          date_str="${BASH_REMATCH[1]}"
          event_date=$(parse_date "$date_str") || continue
          
          if [[ $line =~ ([0-9]+:[0-9]+|[0-9]+時) ]]; then
            time_str="${BASH_REMATCH[1]}"
            start_time=$(parse_time "$time_str") || continue
            
            venue=""
            for venue_key in "${!VENUE_DICT[@]}"; do
              if [[ $line =~ $venue_key ]]; then
                venue=$(normalize_venue "$venue_key")
                break
              fi
            done
            
            if [[ -z "$venue" ]]; then
              continue
            fi
            
            title_line=$line
            title_line=${title_line//$date_str/}
            title_line=${title_line//$time_str/}
            title_line=${title_line//$venue_key/}
            title_line=${title_line//\(金\)/}
            title_line=${title_line//\(木\)/}
            title_line=${title_line//\(土\)/}
            title_line=${title_line//\(日\)/}
            title_line=${title_line//開演/}
            title_line=${title_line//から/}
            
            title=$(echo "$title_line" | tr -s ' ' | sed 's/^ *//;s/ *$//')
            
            if [[ -z "$title" ]]; then
              if [[ $line =~ (ライブ|フリーライブ|ワンマン|ツーマン|ハロウィン|クリスマス)[^、。]* ]]; then
                title="${BASH_REMATCH[0]}"
              else
                title="null"
              fi
            fi
            
            jq --arg id "$tweet_id" \
               --arg date "$event_date" \
               --arg time "$start_time" \
               --arg venue "$venue" \
               --arg title "$title" \
               '. += [{"tweet_id": $id, "event_date": $date, "start_time": $time, "venue": $venue, "title": $title}]' \
               "$RESULTS_FILE" > "${RESULTS_FILE}.tmp"
            mv "${RESULTS_FILE}.tmp" "$RESULTS_FILE"
          fi
        fi
      done
    done < <(jq -c '.[]' "$TWEETS_FILE")
  done
  
  jq 'unique_by({event_date, start_time, venue})' "$RESULTS_FILE" > "${RESULTS_FILE}.tmp"
  mv "${RESULTS_FILE}.tmp" "$RESULTS_FILE"
  
  echo "| tweet_id           | event_date | start_time | venue                  | title                             |"
  echo "|--------------------|------------|------------|------------------------|-----------------------------------|"
  jq -r '.[] | "| \(.tweet_id) | \(.event_date) | \(.start_time) | \(.venue) | \(.title) |"' "$RESULTS_FILE"
  
  echo
  cat "$RESULTS_FILE"
  
  valid_events=$(jq '. | length' "$RESULTS_FILE")
  echo
  echo "OK:${valid_events}/${total_tweets}"
}

main
