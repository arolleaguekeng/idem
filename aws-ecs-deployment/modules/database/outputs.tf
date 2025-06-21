output "db_connection_string" {
  description = "Connection string for the database"
  value       = var.database_type == "mysql" ? "mysql://${var.db_username}:${var.db_password}@${aws_db_instance.main.endpoint}/${var.db_name}" : "postgres://${var.db_username}:${var.db_password}@${aws_db_instance.main.endpoint}/${var.db_name}"
  sensitive   = true
}


output "database_type" {
  description = "Type of database deployed"
  value       = var.database_type
}

output "db_endpoint" {
  description = "Endpoint of the database"
  value       = aws_db_instance.main.endpoint
}