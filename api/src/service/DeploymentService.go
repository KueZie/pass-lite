package service

import (
	"context"
	"fmt"
	"log"
	"os"
	"pass-lite/src/database"
	"time"

	"cloud.google.com/go/storage"
	"golang.org/x/oauth2/google"
	"golang.org/x/oauth2/jwt"
	"google.golang.org/api/option"
)

type DeploymentService struct {
	BucketName          string
	PrivateKey          []byte
	ServiceAccountEmail string
}

type Deployment struct {
	DeploymentName         string `gorm:"column:DeploymentName"`
	DeploymentFileName     string `gorm:"column:DeploymentFileName"`
	DeploymentType		     string `gorm:"column:DeploymentType"`
	DeploymentCreatedAt    time.Time `gorm:"column:DeploymentCreatedAt"`
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

/* CreateDeployment creates a new deployment in the database */
func (d *DeploymentService) CreateDeployment(deployment Deployment) error {
	conn, err := database.CreateDatabaseConnection()
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	if err := conn.Table("DeploymentMetadata").Omit("DeploymentCreatedAt").Create(&deployment).Error; err != nil {
		return fmt.Errorf("conn.Table.Create: %w", err)
	}

	return nil
}

func (d *DeploymentService) GetDeployment(deploymentName string) (*Deployment, error) {
	conn, err := database.CreateDatabaseConnection()
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	var deployment Deployment
	if err := conn.Table("DeploymentMetadata").Where("DeploymentName = ?", deploymentName).First(&deployment).Error; err != nil {
		return nil, fmt.Errorf("conn.Table.Where.First: %w", err)
	}

	return &deployment, nil
}

func (d *DeploymentService) ListDeployments() ([]*Deployment, error) {
	conn, err := database.CreateDatabaseConnection()
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}

	var deployments []*Deployment
	if err := conn.Table("DeploymentMetadata").Find(&deployments).Error; err != nil {
		return nil, fmt.Errorf("conn.Table.Find: %w", err)
	}

	return deployments, nil
}

// CreatePreSignedUploadURL creates a pre-signed URL that can be used to upload a file to the bucket
func (d *DeploymentService) CreateDeploymentUploadUrl(deploymentName string) (string, error) {
	deployment, err := d.GetDeployment(deploymentName)
	if err != nil {
		return "", fmt.Errorf("d.GetDeployment: %w", err)
	}

	ctx := context.Background()
	storageClient, err := storage.NewClient(ctx, option.WithCredentialsFile("pass-lite-credentials.json"))
	if err != nil {
		return "", fmt.Errorf("storage.NewClient: %w", err)
	}
	defer storageClient.Close()

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
		Method:      "PUT",
		Expires:     time.Now().Add(24 * time.Hour),
		ContentType: "application/zip",
	}

	u, err := storageClient.Bucket(d.BucketName).SignedURL(deployment.DeploymentFileName, opts)
	if err != nil {
		return "", fmt.Errorf("Bucket(%q).SignedURL: %w", d.BucketName, err)
	}

	return u, nil

}
