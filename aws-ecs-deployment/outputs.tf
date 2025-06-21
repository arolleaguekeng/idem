output "idem_url" {
  description = "URL of the VOTE service"
  value       =  module.idem.idem_url
}

output "idem-api_url" {
  description   = "URL of the IDEM API service"
  value         = module.idem-api.idem-api_url
}

output "idem-chart_url" {
  description   = "URL of the IDEM Chart service"
  value         = module.idem-chart.idem-chart_url
}

output "idem-webgen_url" {
  description   = "URL of the IDEM Webgen service"
  value         = module.idem-webgen.idem-webgen_url
}
  