package controller

import (
	"log"
	"time"

	"pass-lite/app/model"
	"pass-lite/app/query"

	"github.com/gofiber/fiber/v2"
)


func CreateDeploymentMetadata(c *fiber.Ctx) error {
	log.Printf("request body: %v", string(c.Body()))
	deploymentMetadata := model.DeploymentMetadata{}
	if err := c.BodyParser(&deploymentMetadata); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	log.Printf("deployment metadata: %v", deploymentMetadata)

	if err := query.CreateDeploymentMetadata(&deploymentMetadata); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": fiber.StatusOK,
		"timestamp": time.Now().Unix(),
	})
}

func GetDeploymentMetadata(c *fiber.Ctx) error {
	deploymentName := c.Params("deploymentName")

	deployment, err := query.FindOneDeploymentMetadata(deploymentName)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": fiber.StatusOK,
		"timestamp": time.Now().Unix(),
		"data": deployment,
	})
}

func ListDeploymentMetadata(c *fiber.Ctx) error {
	deployments, err := query.FindAllDeploymentMetadata()
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"status": fiber.StatusOK,
		"timestamp": time.Now().Unix(),
		"data": deployments,
	})
}