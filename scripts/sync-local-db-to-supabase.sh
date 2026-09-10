#!/usr/bin/env bash
set -euo pipefail

LOCAL_DATABASE_URL="${LOCAL_DATABASE_URL:-${DATABASE_URL:-}}"
REMOTE_DATABASE_URL="${SUPABASE_DIRECT_URL:-${DIRECT_URL:-}}"

if [[ -z "$LOCAL_DATABASE_URL" ]]; then
  echo "LOCAL_DATABASE_URL is not set. Example:"
  echo "  export LOCAL_DATABASE_URL='postgresql://postgres:password@localhost:5434/everpeak_db?schema=public'"
  echo "  export SUPABASE_DIRECT_URL='postgresql://postgres:<password>@db.xxxxxx.supabase.co:5432/postgres'"
  exit 1
fi

if [[ -z "$REMOTE_DATABASE_URL" ]]; then
  echo "SUPABASE_DIRECT_URL is not set."
  exit 1
fi

if ! pg_isready -d "$LOCAL_DATABASE_URL" >/dev/null 2>&1; then
  echo "Local PostgreSQL is not running or not reachable from LOCAL_DATABASE_URL"
  echo "Start your local database first, then run this script again."
  exit 1
fi

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
DUMP_FILE="/tmp/everpeak-local-$TIMESTAMP.sql"

 echo "Dumping local database into $DUMP_FILE"
pg_dump "$LOCAL_DATABASE_URL" \
  --clean --if-exists --no-owner --no-privileges \
  --schema=public \
  > "$DUMP_FILE"

 echo "Importing dump into Supabase"
psql "$REMOTE_DATABASE_URL" -v ON_ERROR_STOP=1 -f "$DUMP_FILE"

echo "Database sync finished successfully."
echo "Dump file: $DUMP_FILE"
