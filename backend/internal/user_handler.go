package user

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

var db *sql.DB

func Setup(database *sql.DB) {
	db = database
	// Creating tables
	CreateTable()
	// Prepopulating db with initial data
	SeedData()
}

func ListUsers(c *gin.Context) {
	var users []User
	rows, err := db.Query("SELECT id, name, email FROM users")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()
	// Traverse the rows returned by the query and append each user to the users slice
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.Name, &u.Email); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		users = append(users, u)
	}
	c.JSON(http.StatusOK, users)
}

func GetUser(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var user User
	err = db.QueryRow("SELECT id, name, email FROM users WHERE id = ?", id).Scan(&user.ID, &user.Name, &user.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching user"})
			log.Println("Error fetching user:", err) // Log the actual error for debugging
		}
		return
	}

	c.JSON(http.StatusOK, user)
}

func AddUser(c *gin.Context) {
	var newUser User
	if err := c.BindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Error creating resource.", "error": err.Error()})
		return
	}

	result, err := db.Exec("INSERT INTO users (name, email) VALUES (?, ?)", newUser.Name, newUser.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Error creating resource.", "error": err.Error()})
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Error creating resource.", "error": err.Error()})
		return
	}

	newUser.ID = int(id)
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Resource created successfully.", "data": newUser})
}

func EditUser(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid user ID.", "error": err.Error()})
		return
	}

	var updatedUser User
	if err := c.BindJSON(&updatedUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Error updating resource.", "error": err.Error()})
		return
	}

	_, err = db.Exec("UPDATE users SET name = ?, email = ? WHERE id = ?", updatedUser.Name, updatedUser.Email, id)
	if err != nil { // Assuming 'err' holds the error from your update operation
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Error updating resource.", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Resource updated successfully.", "data": updatedUser})
}

func DeleteUser(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid user ID.", "error": err.Error()})
		return
	}

	_, err = db.Exec("DELETE FROM users WHERE id = ?", id)
	if err != nil { // Assuming 'err' holds the error from your delete operation
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Error deleting resource.", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Resource deleted successfully."})
}

// CreateTable creates the users table if it does not exist
func CreateTable() {
	createTableSQL := `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL
    );`

	_, err := db.Exec(createTableSQL)
	if err != nil {
		log.Fatal("Failed to create table: ", err)
	}
}

// SeedData inserts initial user data if the table is empty
func SeedData() {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM users").Scan(&count)
	if err != nil {
		log.Fatal("Failed to check user count: ", err)
	}

	if count == 0 {
		seedUsers := []User{
			{Name: "John Doe", Email: "john.doe@example.com"},
			{Name: "Jane Smith", Email: "jane.smith@example.com"},
			{Name: "Alice Johnson", Email: "alice.j@example.com"},
			{Name: "Bob Williams", Email: "bob.w@example.com"},
			{Name: "Eva Brown", Email: "eva.b@example.com"},
		}

		for _, user := range seedUsers {
			_, err := db.Exec("INSERT INTO users (name, email) VALUES (?, ?)", user.Name, user.Email)
			if err != nil {
				log.Println("Error seeding data:", err)
			}
		}
		log.Println("Seeded users table with initial data.")
	} else {
		log.Println("Users table already populated. Skipping seeding.")
	}
}
