output "idem-webgen_url" {
  description = "URL of the idem-webgen service"
  value       = aws_lb.idem-webgen.dns_name
}

output "idem-webgen_target_group_arn" {
  description = "ARN of the idem-webgen target group"
  value       = aws_lb_target_group.idem-webgen.arn
}