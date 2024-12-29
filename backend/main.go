package main

import (
	"database/sql"
	"log"
	"time"

	"github.com/gin-contrib/cors"
	user "github.com/maksatabrayev/simple-ums/backend/internal"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	// Connect to SQLite Database
	db, err := sql.Open("sqlite3", "./users.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Setup user package and create table
	user.Setup(db)

	// Set up Gin
	r := gin.Default()
	// CORS configuration
	config := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
	r.Use(cors.New(config))
	// Routes
	r.GET("/users", user.ListUsers)
	r.GET("/users/:id", user.GetUser)
	r.POST("/users", user.AddUser)
	r.PUT("/users/:id", user.EditUser)
	r.DELETE("/users/:id", user.DeleteUser)

	r.Run() // listen and serve on default 0.0.0.0:8080
}
