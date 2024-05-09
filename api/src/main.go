package main

import (
	"log"
	"net/http"
	"pass-lite/src/service"
	"time"

	mux "github.com/gorilla/mux"
)

type DeploymentCreateForm struct {
	Name 					string `json:"name"`
	// Description 	string `json:"description"`
	// Framework 		string `json:"framework"`
}

// Loads a private key from a PEM file



func main() {
	r := mux.NewRouter()

	r.HandleFunc("/deployment/{deploymentName}/upload", service.DeploymentCreateUploadHandler).Methods("POST")
	// Create deployment
	r.HandleFunc("/deployment", service.DeploymentCreateHandler).Methods("POST")
	r.HandleFunc("/deployment/list", service.DeploymentListHandler).Methods("GET")

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
