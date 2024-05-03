package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"pass-lite/src/service"
	"time"

	mux "github.com/gorilla/mux"
)

type DeploymentCreateForm struct {
	Name string `json:"name"`
}

// Loads a private key from a google returned json file
func LoadPrivateKey(fileName string) ([]byte, error) {
	file, err := os.Open(fileName)
	if err != nil {
		log.Fatalf("failed to open private key json file: %v", err)
		return nil, err
	}

	var privateKey map[string]interface{}
	d := json.NewDecoder(file)
	if err := d.Decode(&privateKey); err != nil {
		log.Fatalf("failed to decode private key json file: %v", err)
		return nil, err
	}

	// privateKey is a string
	privateKeyString, ok := privateKey["private_key"].(string)
	if !ok {
		log.Fatalf("private_key is not a string, %v")
		return nil, err
	}

	return []byte(privateKeyString), nil
}

func DeploymentCreateUploadHandler(w http.ResponseWriter, r *http.Request) {
	var deployment DeploymentCreateForm
	err := json.NewDecoder(r.Body).Decode(&deployment)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	pk, error := LoadPrivateKey("pk.json")
	if error != nil {
		http.Error(w, error.Error(), http.StatusInternalServerError)
		return
	}

	deploymentService := service.DeploymentService{
		BucketName: "pass-lite-deployments",
		PrivateKey: pk,
	}

	// Create a new URL to upload the file to
	uploadURL, err := deploymentService.CreatePreSignedUploadURL(deployment.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the URL to the client so they can upload the file directly
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"upload_url": uploadURL})	
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
