package utils

import (
	"github.com/jmoiron/sqlx"

	_ "github.com/lib/pq"
)

// NewPostgresDB creates a new Postgres database connection
func NewPostgresDBRawDSN(dsn string) (*sqlx.DB, error) {
	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func NewPostgresConnection() (*sqlx.DB, error) {
	dsn := "host=localhost port=5430 user=postgres password=password dbname=pass-lite sslmode=disable"
	return NewPostgresDBRawDSN(dsn)
}