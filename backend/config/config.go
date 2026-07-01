package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port         string
	OpenAIKey    string
	SupabaseURL  string
	SupabaseAnon string
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment")
	}

	// Dame la dirección en memoria de Config
	return &Config{
		Port:         getEnv("PORT", "8080"),
		OpenAIKey:    getEnv("OPENAI_API_KEY", ""),
		SupabaseURL:  getEnv("SUPABASE_URL", ""),
		SupabaseAnon: getEnv("SUPABASE_ANON_KEY", ""),
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}

	return fallback
}
