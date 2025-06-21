output "idem_url" {
  description = "URL of the idem service"
  value       = aws_lb.idem.dns_name
}

output "idem_target_group_arn" {
  description = "ARN of the idem target group"
  value       = aws_lb_target_group.idem.arn
}