package database

import (
	"log"

	spannergorm "github.com/googleapis/go-gorm-spanner"
	_ "github.com/googleapis/go-sql-spanner"
	"gorm.io/gorm"
)

func CreateDatabaseConnection() (*gorm.DB, error) {
	db, err := gorm.Open(spannergorm.New(spannergorm.Config{
		DriverName: "spanner",
		DSN:        "projects/pass-lite/instances/pass-lite-database/databases/primary",
	}), &gorm.Config{PrepareStmt: true})
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	return db, nil
}
