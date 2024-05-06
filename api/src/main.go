package main

import (
	"encoding/json"
	"log"
	"net/http"
	"pass-lite/src/service"
	"strings"
	"time"

	mux "github.com/gorilla/mux"
)

type DeploymentCreateForm struct {
	Name 					string `json:"name"`
	// Description 	string `json:"description"`
	// Framework 		string `json:"framework"`
}

// Loads a private key from a PEM file

func DeploymentCreateUploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	ct := r.Header.Get("Content-Type")
    if ct != "" {
        mediaType := strings.ToLower(strings.TrimSpace(strings.Split(ct, ";")[0]))
        if mediaType != "application/json" {
            msg := "Content-Type header is not application/json"
            http.Error(w, msg, http.StatusUnsupportedMediaType)
            return
        }
    }
	var deployment DeploymentCreateForm
	err := json.NewDecoder(r.Body).Decode(&deployment)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Printf("error decoding request body: %s", err)
		return
	}

	deploymentService := service.NewDeploymentService(
		"pass-lite-deployments",
	)

	// Create a new URL to upload the file to
	uploadURL, err := deploymentService.CreatePreSignedUploadURL(deployment.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the URL to the client so they can upload the file directly
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"uploadUrl": uploadURL})	
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/deployment/upload", DeploymentCreateUploadHandler).Methods("POST")

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
