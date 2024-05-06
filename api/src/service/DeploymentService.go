package service

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"cloud.google.com/go/storage"
	"golang.org/x/oauth2/google"
	"golang.org/x/oauth2/jwt"
	"google.golang.org/api/option"
)

type DeploymentUploadService interface {
	CreatePreSignedUploadURL(fileName string) (string, error)
}

type DeploymentService struct {
	BucketName          string
	PrivateKey          []byte
	ServiceAccountEmail string
}

func LoadJWTConfigFromFile(fileName string) (*jwt.Config, error) {
	file, err := os.ReadFile(fileName)
	if err != nil {
		log.Fatalf("failed to read private key file: %v", err)
	}

	cfg, err := google.JWTConfigFromJSON(file)
	if err != nil {
		log.Fatalf("failed to parse private key: %v", err)
	}

	return cfg, err
}

func NewDeploymentService(bucketName string) *DeploymentService {
	cfg, err := LoadJWTConfigFromFile("pass-lite-credentials.json")
	if err != nil {
		log.Fatalf("failed to load private key: %v", err)
	}

	log.Printf("loaded private key for service account: %s", cfg.Email)

	return &DeploymentService{
		BucketName:          bucketName,
		PrivateKey:          cfg.PrivateKey,
		ServiceAccountEmail: cfg.Email,
	}
}

// CreatePreSignedUploadURL creates a pre-signed URL that can be used to upload a file to the bucket
func (d *DeploymentService) CreatePreSignedUploadURL(fileName string) (string, error) {

	ctx := context.Background()
	client, err := storage.NewClient(ctx, option.WithCredentialsFile("pass-lite-credentials.json"))
	if err != nil {
		return "", fmt.Errorf("storage.NewClient: %w", err)
	}
	defer client.Close()

	// Signing a URL requires credentials authorized to sign a URL. You can pass
	// these in through SignedURLOptions with one of the following options:
	//    a. a Google service account private key, obtainable from the Google Developers Console
	//    b. a Google Access ID with iam.serviceAccounts.signBlob permissions
	//    c. a SignBytes function implementing custom signing.
	// In this example, none of these options are used, which means the SignedURL
	// function attempts to use the same authentication that was used to instantiate
	// the Storage client. This authentication must include a private key or have
	// iam.serviceAccounts.signBlob permissions.
	opts := &storage.SignedURLOptions{
		Method:         "PUT",
		Expires:        time.Now().Add(24 * time.Hour),
		ContentType:    "application/zip",
	}

	u, err := client.Bucket(d.BucketName).SignedURL(fileName, opts)
	if err != nil {
		return "", fmt.Errorf("Bucket(%q).SignedURL: %w", d.BucketName, err)
	}

	fmt.Println("Generated PUT signed URL:")
	fmt.Printf("%q\n", u)
	fmt.Println("You can use this URL with any user agent, for example:")
	fmt.Printf("curl -X PUT -H 'Content-Type: application/zip' --upload-file fake %q\n", u)
	return u, nil

}
