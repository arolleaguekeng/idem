variable "deployment_name" {
  description = "Prefix for all resources"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "database_type" {
  description = "Type of database (mysql or postgresql)"
  type        = string
  default     = "mysql"
  validation {
    condition     = contains(["mysql", "postgresql"], var.database_type)
    error_message = "Database type must be either 'mysql' or 'postgresql'."
  }
}