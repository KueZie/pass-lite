package service

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"cloud.google.com/go/storage"
)

type DeploymentUploadService interface {
	CreatePreSignedUploadURL(fileName string) (string, error)
}

type DeploymentService struct {
	BucketName string
	PrivateKey []byte
}

func LoadPrivateKeyJSON(fileName string) ([]byte, error) {
	r, err := os.Open(fileName)
	if err != nil {
		return nil, err
	}

	var j map[string]interface{}
	d := json.NewDecoder(r)
	err = d.Decode(&j)
	if err != nil {
		return nil, err
	}

	pk, ok := j["private_key"].(string)
	if !ok {
		log.Fatalf("private_key not found in %s", fileName)
	}
	return []byte(pk), nil
}

func NewDeploymentService(bucketName string) *DeploymentService {
	key, err := LoadPrivateKeyJSON("pass-lite-credentials.json")
	if err != nil {
		log.Fatalf("failed to load private key: %v", err)
	}

	return &DeploymentService{
		BucketName: bucketName,
		PrivateKey: key,
	}
}

// CreatePreSignedUploadURL creates a pre-signed URL that can be used to upload a file to the bucket
func (d *DeploymentService) CreatePreSignedUploadURL(fileName string) (string, error) {

	opts := &storage.SignedURLOptions{
		GoogleAccessID:  		"deploymentservice@pass-lite.iam.gserviceaccount.com",
		PrivateKey:      		d.PrivateKey,
		Method:          		"PUT",
		Expires:         		time.Now().Add(24 * time.Hour), 
	}

	url, err := storage.SignedURL(d.BucketName, fileName, opts)
	if err != nil {
		log.Printf("failed to create signed url: %v", err)
		return "", err
	}

	return url, nil
}