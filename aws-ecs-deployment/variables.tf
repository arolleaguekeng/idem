variable "deployment_name" {
  description = "Prefix for all resources"
  type        = string
  default     = "microservices"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}



variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}


variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {
    Project     = "Idem"
    Environment = "Production"
    Terraform   = "true"
  }
}


variable "route53_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
  default     = ""
}

variable "gemini_api_key" {
  description = "API key for Google Gemini AI service"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

################## Service Images #################################

variable "idem_image" {
  type        = string
  description = "Image for idem frontend"
  default     = "public.ecr.aws/i4l0v2l9/worker-service:latest"
}


variable "idem-api_image" {
  type        = string
  description = "image for idem api"
  default     = "public.ecr.aws/i4l0v2l9/vote-service:v1"
}

variable "idem-chart_image" {
  type = string
  default = "public.ecr.aws/i4l0v2l9/result-service:latest"

}

variable "idem-webgen_image" {
  type = string
  default = "public.ecr.aws/i4l0v2l9/result-service:latest"

}


###################### Service Ports #####################################

variable "idem-api_port" {
  type        = number
  description =  ""
  default     = 3000
}


variable "idem-chart_port" {
  type        = number
  description = "port du service result"
  default     = 8080
}

variable "idem-webgen_port" {
  type        = number
  description =  ""
  default     = 5173
}

variable "idem" {
  type        = number
  description =  ""
  default     = 80
}


########### Domain Name on services ######################

variable "idem-chart_domain" {
  type        = string
  description = "domain name for idem frontend"
  default     = "idem-chart.azopat.cm"
}

variable "idem-api_domain" {
  type        = string
  description = "domain name for idem-api"
  default     = "idem-api.azopat.cm"
}

variable "root-domain"{
  type         = string
  default      = "azopat.cm"
}

variable "idem-webgen_domain" {
  type        = string
  description = "domain name for idem-webgen"
  default     = "idem-webgen.azopat.cm"
}

########################### CDN Services #########################

variable "cdn_idem" {
  type        = string
  description = ""
  default = "idem_cdn"
}

variable "cdn_idem-api" {
  type        = string
  description = ""
  default     = "idem-api_cdn"
}

 
variable "web-acl-name-idem" {
  type       = string
  description = ""
  default = "idem-waf"
}


variable "web-acl-name-idem-api" {
  type        = string
  description = ""
  default     = "api-waf"
}


##################### Environment variables ##############################

variable "deepseek_api_key" {
  description = "API key for DeepSeek"
  type        = string
  sensitive   = true
}

variable "gemini_api_key" {
  description = "API key for Gemini"
  type        = string
  sensitive   = true
}


variable "firebase_api_key" {
  description = "Firebase API Key"
  type        = string
  sensitive   = true
}

variable "firebase_auth_domain" {
  description = "Firebase Auth Domain"
  type        = string
}

variable "firebase_project_id" {
  description = "Firebase Project ID"
  type        = string
}

variable "firebase_storage_bucket" {
  description = "Firebase Storage Bucket"
  type        = string
}

variable "firebase_messaging_sender_id" {
  description = "Firebase Messaging Sender ID"
  type        = string
}

variable "firebase_app_id" {
  description = "Firebase App ID"
  type        = string
}

variable "firebase_private_key" {
  description = "Private key for Firebase service account"
  type        = string
  sensitive   = true
}

variable "firebase_client_email" {
  description = "Client email for Firebase service account"
  type        = string
}

variable "openrouter_api_key" {
  description = "API key for OpenRouter"
  type        = string
  sensitive   = true
}

variable "api_version" {
  description = "Version of the API"
  type        = string
  default     = "v1"
}

variable "api_llm_model" {
  description = "LLM model used by the API"
  type        = string
  default     = "gpt-3.5-turbo"
}


variable "vite_log_level" {
  description = "Log level for Vite front-end application"
  type        = string
  default     = "info"  # ou "debug", "warn", etc.
}

variable "vite_api_base_url" {
  description = "Base URL for the Vite API"
  type        = string
}

variable "gemini_api_key" {
  description = "API Key for Gemini / Google Generative AI"
  type        = string
  sensitive   = true
}
