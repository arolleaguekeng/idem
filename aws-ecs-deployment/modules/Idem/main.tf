resource "aws_ecs_cluster" "idem" {
  name = "${var.deployment_name}-idem-cluster"
  tags = var.tags
}

resource "aws_cloudwatch_log_group" "idem" {
  name = "/ecs/${var.deployment_name}-idem"
  tags = var.tags
}


resource "aws_ecs_task_definition" "idem" {
  family                   = "${var.deployment_name}-idem"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = var.ecs_task_execution_role_arn
  task_role_arn            = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      name      = "idem"
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
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.idem.name
          awslogs-region       = var.region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])

  tags = var.tags
}

resource "aws_lb" "idem" {
  name               = "${var.deployment_name}-idem-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets            = var.public_subnet_ids

  tags = var.tags
}

resource "aws_lb_target_group" "idem" {
  name        = "${var.deployment_name}-idem-tg"
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

resource "aws_lb_listener" "idem" {
  load_balancer_arn = aws_lb.idem.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.idem.arn
  }

  tags = var.tags
}

resource "aws_ecs_service" "idem" {
  name            = "${var.deployment_name}-idem"
  cluster         = aws_ecs_cluster.idem.id
  task_definition = aws_ecs_task_definition.idem.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.ecs_security_group_id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.idem.arn
    container_name   = "idem"
    container_port   = var.container_port
  }

  tags = var.tags
}

/* resource "aws_security_group_rule" "alb_to_idem" {
  type              = "ingress"
  from_port         = var.container_port  
  to_port           = var.container_port
  protocol          = "tcp"
  security_group_id = var.ecs_security_group_id
  source_security_group_id = var.alb_security_group_id
}
*/