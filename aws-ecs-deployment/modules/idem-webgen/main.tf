resource "aws_ecs_cluster" "idem-webgen" {
  name = "${var.deployment_name}-idem-webgen-cluster"
  tags = var.tags
}

resource "aws_cloudwatch_log_group" "idem-webgen" {
  name = "/ecs/${var.deployment_name}-idem-webgen"
  tags = var.tags
}

locals {
  idem-webgen_env = [
    { name = "VITE_LOG_LEVEL",                  value = var.vite_log_level },
    { name = "VITE_API_BASE_URL",               value = var.vite_api_base_url },
    { name = "GEMINI_API_KEY",                  value = var.gemini_api_key },
    { name = "GOOGLE_GENERATIVE_AI_API_KEY",    value = var.gemini_api_key }, # réutilisation
   
  ]
}


resource "aws_ecs_task_definition" "idem-webgen" {
  family                   = "${var.deployment_name}-idem-webgen"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = var.ecs_task_execution_role_arn
  task_role_arn            = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      name      = "idem-webgen"
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
      environment = local.idem-webgen_env 
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.idem-webgen.name
          awslogs-region       = var.region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])

  tags = var.tags
}

resource "aws_lb" "idem-webgen" {
  name               = "${var.deployment_name}-idem-webgen-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnet_ids

  tags = var.tags
}

resource "aws_lb_target_group" "idem-webgen" {
  name        = "${var.deployment_name}-idem-webgen-tg"
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

resource "aws_lb_listener" "idem-webgen" {
  load_balancer_arn = aws_lb.idem-webgen.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.idem-webgen.arn
  }

  tags = var.tags
}

resource "aws_ecs_service" "idem-webgen" {
  name            = "${var.deployment_name}-idem-webgen"
  cluster         = aws_ecs_cluster.idem-webgen.id
  task_definition = aws_ecs_task_definition.idem-webgen.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.ecs_security_group_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.idem-webgen.arn
    container_name   = "idem-webgen"
    container_port   = var.container_port
  }

  tags = var.tags
}

resource "aws_security_group_rule" "alb_to_idem-webgen" {
  type              = "ingress"
  from_port         = var.container_port  
  to_port           = var.container_port
  protocol          = "tcp"
  security_group_id = var.ecs_security_group_id
  source_security_group_id = var.alb_security_group_id
}