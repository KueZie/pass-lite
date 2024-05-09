package service

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type DeploymentCreateForm struct {
	Name          string `json:"name"`
	Description   string `json:"description"`
	Type					string `json:"type"`

}

func DeploymentCreateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var deployment DeploymentCreateForm
	err := json.NewDecoder(r.Body).Decode(&deployment)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	deploymentService := NewDeploymentService(
		"pass-lite-deployments",
	)
	err = deploymentService.CreateDeployment(Deployment{
		DeploymentName:     deployment.Name,
		DeploymentFileName: deployment.Name + ".zip",
		DeploymentType:     deployment.Type,
	})
	if err != nil {
		log.Printf("failed to create deployment: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func DeploymentCreateUploadHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	// Parse resource name from URL
	vars := mux.Vars(r)
	deploymentName, ok := vars["deploymentName"]
	if !ok {
		http.Error(w, "missing deployment name", http.StatusBadRequest)
		return
	}

	
	deploymentService := NewDeploymentService(
		"pass-lite-deployments",
	)
	deployment, err := deploymentService.GetDeployment(deploymentName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Create a new URL to upload the file to
	uploadURL, err := deploymentService.CreateDeploymentUploadUrl(deployment.DeploymentName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the URL to the client so they can upload the file directly
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"uploadUrl": uploadURL})	
}

// Get a list of deployment details for a user
func DeploymentListHandler(w http.ResponseWriter, r *http.Request) {
	deploymentService := NewDeploymentService(
		"pass-lite-deployments",
	)

	deployments, err := deploymentService.ListDeployments()
	if err != nil {
		log.Printf("failed to list deployments: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(deployments)
}

