package query

import (
	"log"
	"pass-lite/app/model"
	"pass-lite/pkg/utils"
)

func FindOneDeploymentMetadata(deploymentName string) (model.DeploymentMetadata, error) {
	var deployment model.DeploymentMetadata

	c, err := utils.NewPostgresConnection()
	if err != nil {
		return deployment, err
	}

	err = c.Get(&deployment, "SELECT * FROM deployment_metadata WHERE name = $1 LIMIT 1", deploymentName)
	if err != nil {
		return deployment, err
	}

	return deployment, nil
}

func FindAllDeploymentMetadata() ([]model.DeploymentMetadata, error) {
	var deployments []model.DeploymentMetadata

	c, err := utils.NewPostgresConnection()
	if err != nil {
		return nil, err
	}

	err = c.Select(&deployments, "SELECT * FROM deployment_metadata")
	if err != nil {
		return nil, err
	}

	return deployments, nil
}

func CreateDeploymentMetadata(deploymentMetadata *model.DeploymentMetadata) error {
	c, err := utils.NewPostgresConnection()
	if err != nil {
		return err
	}

	_, err = c.Exec(
		"INSERT INTO deployment_metadata (name, type, region, source, source_url) VALUES ($1, $2, $3, $4, $5)",
		deploymentMetadata.Name, deploymentMetadata.Type, deploymentMetadata.Region, deploymentMetadata.Source, deploymentMetadata.SourceUrl)
	if err != nil {
		log.Printf("error creating deployment metadata: %v", err)
		return err
	}

	return nil
}
