#!/bin/bash
set -e

CLEAN_USER=$(echo "$APP_DB_USER" | tr -d '\r' | xargs)
CLEAN_PASSWORD=$(echo "$APP_DB_PASSWORD" | tr -d '\r' | xargs)
CLEAN_DB=$(echo "$POSTGRES_DB" | tr -d '\r' | xargs)

echo "🔒 SECURE PROVISIONING: Creating sanitized low-privilege role [$CLEAN_USER]..."

psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "$CLEAN_DB" <<-EOSQL
    CREATE ROLE $CLEAN_USER WITH LOGIN ENCRYPTED PASSWORD '$CLEAN_PASSWORD';
    REVOKE ALL PRIVILEGES ON DATABASE $CLEAN_DB FROM $CLEAN_USER;
    GRANT CONNECT ON DATABASE $CLEAN_DB TO $CLEAN_USER;
    GRANT ALL ON SCHEMA public TO $CLEAN_USER;
    ALTER SCHEMA public OWNER TO $CLEAN_USER;
EOSQL

echo "host $CLEAN_DB $CLEAN_USER 0.0.0.0/0 scram-sha-256" >> "$PGDATA/pg_hba.conf"

# DYNAMIC SCHEMA RUNNER
# We force the admin user to run the schema file, but we pass the clean app user variable
# straight into the script context so it can execute 'SET ROLE' without hardcoding!
echo "🧱 AUTOMATION: Executing store schema with dynamic role mapping..."
psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "$CLEAN_DB" \
     --variable=app_user="$CLEAN_USER" \
     -f "/docker-entrypoint-initdb.d/01_store_schema.sql.template"

echo "✅ SECURE PROVISIONING: Initialization pipeline complete."

# DYNAMIC DUMMY DATA RUNNER
echo "🌱 AUTOMATION: Injecting database placeholder seed records..."
psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "$CLEAN_DB" \
     --variable=app_user="$CLEAN_USER" \
     -f "/docker-entrypoint-initdb.d/02_dummy_data.sql.template"

echo "✅ SECURE PROVISIONING: Complete data initialization pipeline finished successfully."
