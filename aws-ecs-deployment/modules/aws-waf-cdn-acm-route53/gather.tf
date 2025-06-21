data "aws_route53_zone" "zone" {
  name         = var.root-domain
  private_zone = false
}

data "aws_lb" "web-alb" {
  name = var.alb
}