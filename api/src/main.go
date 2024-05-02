package main

import (
	"log"
	"net/http"
	"time"

	mux "github.com/gorilla/mux"
)

func DeploymentUploadHandler(w http.ResponseWriter, r *http.Request) {
	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "failed to read form file", http.StatusBadRequest)
		return
	}

	// deployments must be .zip files
	if header.Header.Get("Content-Type") != "application/zip" {
		http.Error(w, "invalid file type, expected .zip", http.StatusBadRequest)
		return
	}
		
	// upload the file to the bucket
	storage := &BucketStorage{BucketName: "pass-lite-deployments"}
	storage.UploadFile(file, header.Filename)
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/deployment/upload", DeploymentUploadHandler).Methods("POST")

	http.Handle("/", r)

	log.Println("server starting on :8080")
	

	server := &http.Server{
		Handler:    r,
		Addr:       ":8080",

		// Timeouts
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	err := server.ListenAndServe()
	if err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
