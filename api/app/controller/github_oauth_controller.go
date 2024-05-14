package controller

import (
	"log"

	"golang.org/x/oauth2"

	"github.com/gofiber/fiber/v2"
)

func NewGithubOAuthConfig() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     "",
		ClientSecret: "",
		Scopes:       []string{"repo", "user"},
		Endpoint: oauth2.Endpoint{
			AuthURL:  "https://github.com/login/oauth/authorize",
			TokenURL: "https://github.com/login/oauth/access_token",
		},
		RedirectURL: "http://localhost:8080/api/oauth/github/callback",
	}
}

func AuthorizeGithub(c *fiber.Ctx) error {
	config := NewGithubOAuthConfig()

	redirect_url := config.AuthCodeURL("github_oauth_state")
	return c.Redirect(redirect_url)
}

func AuthorizeGithubCallback(c *fiber.Ctx) error {
	config := NewGithubOAuthConfig()

	code := c.Query("code")
	token, err := config.Exchange(c.Context(), code, oauth2.ApprovalForce)
	if err != nil {
		log.Printf("Error exchanging token for code: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "ExchangeTokenError",
			"msg":   "Error exchanging token for code",
		})
	}

	log.Printf("token: %v", token)

	c.Cookie(&fiber.Cookie{
		Name:   "github_token",
		Value:  token.AccessToken,
		Domain: "localhost",
	})
	c.Cookie(&fiber.Cookie{
		Name:   "github_username",
		Value:  "KueZie",
		Domain: "localhost",
	})
	
	return c.Redirect("http://localhost:3000/dashboard/deployments/setup?source=github")
}
