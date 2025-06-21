resource "aws_ecs_cluster" "idem-api" {
  name = "${var.deployment_name}-idem-api-cluster"
  tags = var.tags
}

resource "aws_cloudwatch_log_group" "idem-api" {
  name = "/ecs/${var.deployment_name}-idem-api"
  tags = var.tags
}

locals {
  idem-api_env = [
    { name = "DEEPSEEK_API_KEY",              value = var.deepseek_api_key },
    { name = "GEMINI_API_KEY",                value = var.gemini_api_key },
    { name = "PORT",                          value = var.port },
    { name = "FIREBASE_API_KEY",              value = var.firebase_api_key },
    { name = "FIREBASE_AUTH_DOMAIN",          value = var.firebase_auth_domain },
    { name = "FIREBASE_PROJECT_ID",           value = var.firebase_project_id },
    { name = "FIREBASE_STORAGE_BUCKET",       value = var.firebase_storage_bucket },
    { name = "FIREBASE_MESSAGING_SENDER_ID",  value = var.firebase_messaging_sender_id },
    { name = "FIREBASE_APP_ID",               value = var.firebase_app_id },
    { name = "FIREBASE_PRIVATE_KEY",          value = var.firebase_private_key },
    { name = "FIREBASE_CLIENT_EMAIL",         value = var.firebase_client_email },
  ]
}


resource "aws_ecs_task_definition" "idem-api" {
  family                   = "${var.deployment_name}-idem-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = var.ecs_task_execution_role_arn
  task_role_arn            = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      name      = "idem-api"
      image     = var.image_url
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
        }
      ]
      environment = local.idem-api_env 
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.idem-api.name
          awslogs-region       = var.region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])

  tags = var.tags
}

resource "aws_lb" "idem-api" {
  name               = "${var.deployment_name}-idem-api-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnet_ids

  tags = var.tags
}

resource "aws_lb_target_group" "idem-api" {
  name        = "${var.deployment_name}-idem-api-tg"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

   health_check {
    path                = "/"                 
    interval            = 30                 
    timeout             = 5                  
    healthy_threshold   = 3                   
    unhealthy_threshold = 3                  
    matcher             = "200-499"          
  }

  tags = var.tags
}

resource "aws_lb_listener" "idem-api" {
  load_balancer_arn = aws_lb.idem-api.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.idem-api.arn
  }

  tags = var.tags
}

resource "aws_ecs_service" "idem-api" {
  name            = "${var.deployment_name}-idem-api"
  cluster         = aws_ecs_cluster.idem-api.id
  task_definition = aws_ecs_task_definition.idem-api.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.ecs_security_group_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.idem-api.arn
    container_name   = "idem-api"
    container_port   = var.container_port
  }

  tags = var.tags
}

resource "aws_security_group_rule" "alb_to_idem-api" {
  type              = "ingress"
  from_port         = var.container_port  
  to_port           = var.container_port
  protocol          = "tcp"
  security_group_id = var.ecs_security_group_id
  source_security_group_id = var.alb_security_group_id
}