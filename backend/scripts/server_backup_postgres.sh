#!/usr/bin/env sh
set -eu

BACKUP_DIR="${BACKUP_DIR:-/var/backups/padel_companion}"
RETENTION_DAYS="${RETENTION_DAYS:-21}"
DB_CONTAINER="${DB_CONTAINER:-vad_hander_db}"
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
ENV_FILE="${ENV_FILE:-$SCRIPT_DIR/../.env}"

read_env_value() {
  key="$1"
  if [ ! -f "$ENV_FILE" ]; then
    return 0
  fi
  awk -F= -v key="$key" '$1 == key { print substr($0, index($0, "=") + 1) }' "$ENV_FILE" | tail -n 1
}

PGDATABASE="${PGDATABASE:-$(read_env_value PGDATABASE)}"
PGUSER="${PGUSER:-$(read_env_value PGUSER)}"
PGPASSWORD="${PGPASSWORD:-$(read_env_value PGPASSWORD)}"
PGPASSWORD="$(printf '%s' "$PGPASSWORD" | sed 's/\$\$/\$/g')"

if [ -z "$PGPASSWORD" ]; then
  echo "PGPASSWORD is required"
  exit 1
fi

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

tmp_file="$BACKUP_DIR/.${PGDATABASE}_${timestamp}.dump.tmp"
final_file="$BACKUP_DIR/${PGDATABASE}_${timestamp}.dump"

docker exec \
  -e PGPASSWORD="$PGPASSWORD" \
  "$DB_CONTAINER" \
  pg_dump \
  -U "$PGUSER" \
  -d "$PGDATABASE" \
  -Fc > "$tmp_file"

mv "$tmp_file" "$final_file"
chmod 600 "$final_file"

docker cp "$final_file" "$DB_CONTAINER:/tmp/padel_companion_verify.dump"

docker exec \
  -e PGPASSWORD="$PGPASSWORD" \
  "$DB_CONTAINER" \
  sh -lc 'pg_restore --list /tmp/padel_companion_verify.dump >/dev/null && rm -f /tmp/padel_companion_verify.dump'

find "$BACKUP_DIR" -type f -name "${PGDATABASE}_*.dump" -mtime +"$RETENTION_DAYS" -delete

echo "Backup created: $final_file"
