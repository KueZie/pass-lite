package model

type DeploymentMetadata struct {
	Name string `json:"name" db:"name"`
	Source string `json:"source" db:"source"`
	SourceUrl string `json:"sourceUrl" db:"source_url"`
	Type string `json:"type" db:"type"`
	Region string `json:"region" db:"region"`
}