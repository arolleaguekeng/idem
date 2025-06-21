output "idem-api_url" {
  description = "URL of the idem-api service"
  value       = aws_lb.idem-api.dns_name
}

output "idem-api_target_group_arn" {
  description = "ARN of the idem-api target group"
  value       = aws_lb_target_group.idem-api.arn
}