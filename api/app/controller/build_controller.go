package controller

import (
	"log"
	"pass-lite/app/query"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/codebuild"

	"github.com/gofiber/fiber/v2"
)

func CreateBuildProject(c *fiber.Ctx) error {
	// Get deployment metadata from request body
	deploymentName := c.Params("deploymentName")

	// look up deployment metadata
	deployment, err := query.FindOneDeploymentMetadata(deploymentName)
	if err != nil {
		log.Printf("error finding deployment metadata: %v", err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	// Create a new CodeBuild client
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
		Config: aws.Config{
			Region: aws.String(deployment.Region),
		},
	}))

	svc := codebuild.New(sess)

	buildInput := &codebuild.CreateProjectInput{
		Name: aws.String(deployment.Name),
		Source: &codebuild.ProjectSource{
			Type:     aws.String(deployment.Source),
			Location: aws.String(deployment.SourceUrl),
		},
		Artifacts: &codebuild.ProjectArtifacts{
			Type: aws.String("NO_ARTIFACTS"),
		},
		Environment: &codebuild.ProjectEnvironment{
			ComputeType: aws.String("BUILD_GENERAL1_SMALL"),
			Image:       aws.String("aws/codebuild/standard:4.0"),
			Type:        aws.String("LINUX_CONTAINER"),
		},
		ServiceRole: aws.String("arn:aws:iam::590184043968:role/PassLiteCodeBuildAccess"),
	}

	output, err := svc.CreateProject(buildInput)
	if err != nil {
		log.Printf("error creating build project: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":    fiber.StatusOK,
		"timestamp": time.Now().Unix(),
		"data":      output,
	})
}

func StartBuildProject(c *fiber.Ctx) error {
	// Get deployment metadata from request body
	deploymentName := c.Params("deploymentName")

	// look up deployment metadata
	d, err := query.FindOneDeploymentMetadata(deploymentName)
	if err != nil {
		log.Printf("error finding deployment metadata: %v", err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
		Config: aws.Config{
			Region: aws.String(d.Region),
		},
	}))

	svc := codebuild.New(sess)

	output, err := svc.StartBuild(&codebuild.StartBuildInput{
		ProjectName: aws.String(deploymentName),
		SourceVersion: aws.String("main"),
		ArtifactsOverride: &codebuild.ProjectArtifacts{
			Type: aws.String("S3"),
			Location: aws.String("passlite-build-artifacts"),
			Packaging: aws.String("ZIP"),
		},
	})
	if err != nil {
		log.Printf("error starting build project: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status":    fiber.StatusOK,
		"timestamp": time.Now().Unix(),
		"data":      output,
	})
}
