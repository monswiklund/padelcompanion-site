#!/usr/bin/env sh
set -eu

BACKUP_DIR="${BACKUP_DIR:-/var/backups/padel_companion}"
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
PGPASSWORD="${PGPASSWORD:-$(read_env_value PGPASSWORD)}"
PGPASSWORD="$(printf '%s' "$PGPASSWORD" | sed 's/\$\$/\$/g')"

latest_backup="$(find "$BACKUP_DIR" -type f -name "${PGDATABASE}_*.dump" | sort | tail -n 1)"

if [ -z "${latest_backup:-}" ]; then
  echo "No backup found in $BACKUP_DIR"
  exit 1
fi

docker cp "$latest_backup" "$DB_CONTAINER:/tmp/padel_companion_verify.dump"

docker exec \
  -e PGPASSWORD="$PGPASSWORD" \
  "$DB_CONTAINER" \
  sh -lc 'pg_restore --list /tmp/padel_companion_verify.dump >/dev/null && rm -f /tmp/padel_companion_verify.dump'

echo "Restore verification passed: $latest_backup"
