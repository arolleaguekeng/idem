
output "idem-chart_url" {
  description = "URL of the worker service"
  value       = aws_lb.idem-chart.dns_name
}


 output "idem-chart_target_group_arn" {
  description = "ARN of the worker target group"
  value       = aws_lb_target_group.idem-chart.arn
}
