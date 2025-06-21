variable "deployment_name" {
  description = "Prefix for all resources"
  type        = string
}

variable "database_type" {
  description = "Type of database (mysql or postgresql)"
  type        = string
  default     = "postgresql"
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group ID for database access"
  type        = string
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "db_name" {
  description = "name of the database"
  type        = string
  default     = "odypharm"
}