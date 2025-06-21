resource "random_id" "db_suffix" {
  byte_length = 2
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.deployment_name}-db-subnet-group"
  subnet_ids = var.private_subnet_ids
  tags = merge(
    var.tags,
    {
      Name = "${var.deployment_name}-db-subnet-group"
    }
  )
}

resource "aws_db_instance" "main" {
  identifier             = "${var.deployment_name}-db-${random_id.db_suffix.hex}"
  allocated_storage      = 10
  storage_type           = "gp2"
  engine                 = var.database_type == "mysql" ? "mysql" : "postgres"
  engine_version         = var.database_type == "mysql" ? "8.0" : "14"
  instance_class         = "db.t3.micro"
  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  parameter_group_name   = var.database_type == "mysql" ? "default.mysql8.0" : "default.postgres14"
  skip_final_snapshot    = true
  vpc_security_group_ids = [var.security_group_id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  publicly_accessible    = false
  tags                   = var.tags
}