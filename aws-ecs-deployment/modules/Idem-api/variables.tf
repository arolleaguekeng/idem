variable "db_endpoint" {
  type        = string
  description = "Endpoint de la base de données RDS"
}

variable "db_username" {
  type        = string
  sensitive   = true
  description = "Nom d'utilisateur de la base de données"
}

variable "db_password" {
  type        = string
  sensitive   = true
  description = "Mot de passe de la base de données"
}

variable "db_name" {
  type        = string
  description = "Nom de la base de données"
}

variable "image_url" {
  type        = string
  description = "URL de l'image Docker"
}

variable "container_port" {
  type        = number
  default     = 80
  description = "Port du container"
}

variable "task_cpu" {
  type        = number
  default     = 256
  description = "CPU alloué (unités AWS)"
}

variable "task_memory" {
  type        = number
  default     = 512
  description = "Mémoire allouée (MB)"
}

variable "deployment_name" {
  description = "Prefix for all resources"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}
variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs"
  type        = list(string)
}

variable "ecs_security_group_id" {
  description = "ECS security group ID"
  type        = string
}

variable "alb_security_group_id" {
  description = "ALB security group ID"
  type        = string
}

variable "ecs_task_execution_role_arn" {
  description = "ECS task execution role ARN"
  type        = string
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "vpc_id" {
  
}


variable "deepseek_api_key" {
  description = "API key for DeepSeek"
  type        = string
  sensitive   = true
}

variable "gemini_api_key" {
  description = "API key for Gemini"
  type        = string
  sensitive   = true
}

variable "port" {
  description = "Application listening port"
  type        = number
  default     = 3000
}

# Firebase Config
variable "firebase_api_key" {
  description = "Firebase API Key"
  type        = string
  sensitive   = true
}

variable "firebase_auth_domain" {
  description = "Firebase Auth Domain"
  type        = string
}

variable "firebase_project_id" {
  description = "Firebase Project ID"
  type        = string
}

variable "firebase_storage_bucket" {
  description = "Firebase Storage Bucket"
  type        = string
}

variable "firebase_messaging_sender_id" {
  description = "Firebase Messaging Sender ID"
  type        = string
}

variable "firebase_app_id" {
  description = "Firebase App ID"
  type        = string
}

variable "firebase_private_key" {
  description = "Private key for Firebase service account"
  type        = string
  sensitive   = true
}

variable "firebase_client_email" {
  description = "Client email for Firebase service account"
  type        = string
}

variable "openrouter_api_key" {
  description = "API key for OpenRouter"
  type        = string
  sensitive   = true
}

# Optional: Add URLs as variables if needed
variable "api_url" {
  description = "Base URL of the API service"
  type        = string
  default     = "https://api.idem.africa"
}

variable "api_version" {
  description = "Version of the API"
  type        = string
  default     = "v1"
}

variable "api_llm_model" {
  description = "LLM model used by the API"
  type        = string
  default     = "gpt-3.5-turbo"
}

variable "webgen_url" {
  description = "URL of Webgen service"
  type        = string
  default     = "https://webgen.idem.africa"
}

variable "diagen_url" {
  description = "URL of Diagen service"
  type        = string
  default     = "http://chart.idem.africa"
}
variable "idem_url" {
  description = "URL of the Idem service"
  type        = string
  default     = "https://idem.africa"
}
