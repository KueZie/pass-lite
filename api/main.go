package main

import (
	"time"

	"pass-lite/app/controller"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	app := fiber.New()
	app.Use(logger.New())

	api := app.Group("/api")

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":    fiber.StatusOK,
			"timestamp": time.Now().Unix(),
		})
	})

	api.Get("/version", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"version": "v1",
		})
	})

	d := api.Group("/deployment")
	d.Post("/", controller.CreateDeploymentMetadata)
	d.Get("/:deploymentName", controller.GetDeploymentMetadata)
	d.Get("/", controller.ListDeploymentMetadata)

	app.Listen(":8080")
}