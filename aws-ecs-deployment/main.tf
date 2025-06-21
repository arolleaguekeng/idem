module "networking" {
  source              = "./modules/networking"
  deployment_name     = var.deployment_name
  vpc_cidr            = var.vpc_cidr
  private_subnet_cidrs = var.private_subnet_cidrs
  public_subnet_cidrs  = var.public_subnet_cidrs
  availability_zones   = var.availability_zones
  tags                = var.tags
}

module "iam" {
  source          = "./modules/iam"
  deployment_name = var.deployment_name
  tags           = var.tags
}


# Module Idem frontend

module "idem" {
  source                    = "./modules/Idem"
  deployment_name           = var.deployment_name
  region                    = var.region
  image_url                 = var.idem_image
  container_port            = var.idem
  task_cpu                  = 256
  task_memory               = 512
  private_subnet_ids        = module.networking.private_subnet_ids
  public_subnet_ids         = module.networking.public_subnet_ids
  ecs_security_group_id     = module.networking.ecs_security_group_id
  alb_security_group_id     = module.networking.alb_security_group_id
  ecs_task_execution_role_arn = module.iam.ecs_task_execution_role_arn
  vpc_id                    = module.networking.vpc_id
  tags                      = var.tags
}

# Module IDem API
module "idem-api" {
  source                     = "./modules/Idem-api"
  deployment_name            = var.deployment_name
  region                     = var.region
  private_subnet_ids         = module.networking.private_subnet_ids
  public_subnet_ids          = module.networking.public_subnet_ids
  ecs_security_group_id      = module.networking.ecs_security_group_id
  alb_security_group_id      = module.networking.alb_security_group_id
  ecs_task_execution_role_arn = module.iam.ecs_task_execution_role_arn
  vpc_id                     = module.networking.vpc_id
  tags                       = var.tags
  image_url                  = var.idem-api_image
  container_port             = var.idem-api_port
  deepseek_api_key            = var.deepseek_api_key
  gemini_api_key              = var.gemini_api_key

  firebase_api_key            = var.firebase_api_key
  firebase_auth_domain        = var.firebase_auth_domain
  firebase_project_id         = var.firebase_project_id
  firebase_storage_bucket     = var.firebase_storage_bucket
  firebase_messaging_sender_id = var.firebase_messaging_sender_id
  firebase_app_id             = var.firebase_app_id
  firebase_private_key        = var.firebase_private_key
  firebase_client_email       = var.firebase_client_email
}

# Module IDem Chart
module "idem-chart" {
  source                     = "./modules/idem-chart"
  deployment_name            = var.deployment_name
  region                     = var.region
  private_subnet_ids         = module.networking.private_subnet_ids
  public_subnet_ids          = module.networking.public_subnet_ids
  ecs_security_group_id      = module.networking.ecs_security_group_id
  alb_security_group_id      = module.networking.alb_security_group_id
  ecs_task_execution_role_arn = module.iam.ecs_task_execution_role_arn
  vpc_id                     = module.networking.vpc_id
  tags                       = var.tags
  image_url                  = var.idem-chart_image
  container_port             = var.idem-chart_port
  depends_on = [module.idem-api]
}

# Module IDem Webgen
module "idem-webgen" {
  source = "./modules/idem-webgen"

  deployment_name            = var.deployment_name
  region                     = var.region
  image_url                  = var.idem-webgen_image
  container_port             = var.idem-webgen_port
  task_cpu                   = 256                         # ou override par variable si besoin
  task_memory                = 512                         # ou override par variable si besoin

  private_subnet_ids         = module.networking.private_subnet_ids
  public_subnet_ids          = module.networking.public_subnet_ids
  ecs_security_group_id      = module.networking.ecs_security_group_id
  alb_security_group_id      = module.networking.alb_security_group_id
  ecs_task_execution_role_arn = module.iam.ecs_task_execution_role_arn

  vite_log_level             = var.vite_log_level
  vite_api_base_url          = module.idem-api.idem-api_url
  gemini_api_key             = var.gemini_api_key

  vpc_id                     = module.networking.vpc_id

  tags                       = var.tags
}


# Module CDN et WAF pour IDem 
module "cdn-idem" {
  source = "./modules/aws-waf-cdn-acm-route53"
  domain-name  = var.root-domain
  cdn-name     = var.cdn_idem
  deployment_name = var.deployment_name
  web_acl_name = var.web-acl-name-idem
  alb          =  "${var.deployment_name}-idem-lb"  
  root-domain  =  var.root-domain
  depends_on = [module.idem]
}


# Module CDN et WAF pour IDem Chart
module "cdn-idem-chart" {
  source = "./modules/aws-waf-cdn-acm-route53"
  domain-name  = var.idem-chart_domain
  cdn-name     = "${var.deployment_name}-idem-chart-cdn"
  deployment_name = var.deployment_name
  web_acl_name = var.web-acl-name-idem
  alb          =  "${var.deployment_name}-idem-chart-lb"
  root-domain  =  var.root-domain
   depends_on = [module.idem-chart]
}

# Module CDN et WAF pour IDem API
module "cdn-idem-api" {
  source = "./modules/aws-waf-cdn-acm-route53"
  domain-name  = var.idem-api_domain
  cdn-name     = var.cdn_idem-api
  deployment_name = var.deployment_name
  web_acl_name = var.web-acl-name-idem-api
  alb          =  "${var.deployment_name}-idem-api-lb"  
  root-domain  =  var.root-domain
  depends_on = [module.idem-api]
}

# Module CDN et WAF pour IDem Webgen
module "cdn-idem-webgen" {
  source = "./modules/aws-waf-cdn-acm-route53"
  domain-name  = var.idem-webgen_domain
  cdn-name     = "${var.deployment_name}-idem-webgen-cdn"
  deployment_name = var.deployment_name
  web_acl_name = "${var.deployment_name}-idem-webgen-waf"
  alb          =  "${var.deployment_name}-idem-webgen-lb"
  root-domain  =  var.root-domain
  depends_on = [module.idem-webgen]
}
