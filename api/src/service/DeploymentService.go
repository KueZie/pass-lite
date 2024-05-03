package service

import (
	"log"
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

func NewDeploymentService(bucketName string, privateKey []byte) *DeploymentService {
	return &DeploymentService{
		BucketName: bucketName,
		PrivateKey: privateKey,
	}
}

// CreatePreSignedUploadURL creates a pre-signed URL that can be used to upload a file to the bucket
func (d *DeploymentService) CreatePreSignedUploadURL(fileName string) (string, error) {

	opts := &storage.SignedURLOptions{
		GoogleAccessID:  		"deploymentservice@pass-lite.iam.gserviceaccount.com",
		PrivateKey:      		d.PrivateKey,
		Method:          		"GET",
		Expires:         		time.Now().Add(24 * time.Hour), 
		ContentType:     		"application/zip",
	}

	url, err := storage.SignedURL(d.BucketName, fileName, opts)
	if err != nil {
		log.Printf("failed to create signed url: %v", err)
		return "", err
	}

	return url, nil
}