# Identité du déploiement
deployment_name = "microservices"
region          = "us-east-1"

availability_zones = ["us-east-1a", "us-east-1b"]

private_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
public_subnet_cidrs  = ["10.0.101.0/24", "10.0.102.0/24"]

tags = {
  Project     = "Idem"
  Environment = "Production"
  Terraform   = "true"
}

aws_access_key = "AKIAxxxxxxxxxxxxxxxx"
aws_secret_key = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

route53_zone_id = ""

# Images des services
idem_image         = "ghcr.io/idem-ia/idem:latest"
idem-api_image     = "ghcr.io/idem-ia/idem-api:latest"
idem-chart_image   = "ghcr.io/idem-ia/idem-chart:latest"
idem-webgen_image  = "ghcr.io/idem-ia/idem-webgen:latest"

# Ports des services
idem               = 80
idem-api_port      = 3000
idem-chart_port    = 8080
idem-webgen_port   = 5173

# Domaines
idem-chart_domain    = "idem-chart.azopat.cm"
idem-api_domain      = "idem-api.azopat.cm"
idem-webgen_domain   = "idem-webgen.azopat.cm"
root-domain          = "azopat.cm"

# CDN & WAF
cdn_idem              = "idem_cdn"
cdn_idem-api          = "idem-api_cdn"
web-acl-name-idem     = "idem-waf"
web-acl-name-idem-api = "api-waf"

# Variables d'environnement sensibles ( ne jamais versionner ce fichier avec Git)
deepseek_api_key         = "sk-1682233fc8b642e78e3a43fdf52723be"
gemini_api_key           = "AIzaSyDYtsJ3AJEG22uVdc84_SI-ANLDL8NyyQI"
firebase_api_key         = "AIzaSyCsUpHmK5-o4hp8_HldvlaLU2gLOUVeHgY"
firebase_private_key     = <<EOT
-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDW6aObLw11aMFM
D7It/K4425kfIPsBKZlP7s0xQQZKfdOu3XTXHgLVZ2BHpJokisFKUNl5tmrrGAnv
Ag+PTzUdyAu61zw33NhQGIqsS8Kkw/NpYK/Z8CrlD03s2GYOiyyh7yQvkam2BL74
N/aIlzwVyhMpLaS73RiakcMZvvOJVIi4m8HMSxGdlU4BPpGwWEJmtbgtOUGPFep5
6GbxzpMZD92bHu1CzmMytxOjPr5FDBmssiTVxaKqigIarHVr3o8YO+Jq4EUWtEyj
Ac/d1MsZSc90289BpFqaV1e21dXlrk/5wSpT2h/jeQ2awyK1bcnUhb/vRmbn0aJV
Un42MjKjAgMBAAECggEACU2h5HTb+0omm/lN+Emo7RMshLlzxDAdz+UBgvFSqWTb
BgXWKf3Fl6Fa/J72gUB0b5giYe9wn26x92O6crS2Euz2/QaWN8DaqFT3o8+/xEwr
PFOQKToJUVMhR3Bysox5ySTGBz0iAJwh/DLH/E+3rSXLQIwWRn+isgY/UN0AQ+CN
nkW475U6onFi8Vp0JGLIkDJJYHjPC4CcvdItI0BF9jIPriuzbnWQErDc7sGMMS+k
NBDcDBIbFIw7OWJXUdAvM0OZpPSexLIv4HR8Nnc2GXDDRNEeJLlRa89vE9om7SDd
WHAlUCV2hMLEekUlPhbM4ye/oi8snyZBmQtLjaZ4gQKBgQDwXd6dtv1AhnXUk3gx
Qs6rvRMEqPk2Mtu8PtMREFmpp14Fjk1r565cpId1vOJg93WWAXEqrTvmub+Pc0PD
3K2Ba+JfOGWzAWUZ0/fULjj/JnzecWT/4/Sa5ZY2RwTL+erZFFLl21iGIleGauBm
6daRCAkGrT/ZL+hAQUHyNV6vQQKBgQDk4/URjqgfoBl7439Q6/cMsX/omOXC9njI
UKg+YXb31vAHIeY0jO+cajAC/6x/tQN8BnoWI0pf7lOJhLUPZBp+P1zE7eAcehtx
A4YWfZRYqHVZLxqAg4tHxUfdAw+uwdKU08pUr9da7grykJAH7vWcbGsljCB4CFK2
JsDQf1XM4wKBgQC4+WQRtvqZp2ASIRKDxkfJfg2ernJqNSVIboh7PzvhBT2jxOjr
uzVBchQUlTEZMhY5RA7Uqs/INPWn7SofFjonuOBSKtKIuPAWujqj/JY8NGAvxs/U
5JYehcPdLTYRytfiCnPpE63CO7djZ+gdCqLmpWpcywKxnt56ZD3dqRiegQKBgQC8
3bBxLVJizhtZE64RWrN+oNQXXFpyFigxugQpfQjKlmt2py0p/YUVfrVhNBDlS7q1
Uy7YJ4SORbxeg8dXDNWjiKsGv/Wl6cfM6AhzdGm9AjvaPDjVBDYgIZQbtRPysnIN
ZfjVCkdb+4HDBzAhq7a0vO1ojQiZotyE+tMs93UX2wKBgQDn3+orQf4dk0CTqCsL
TlvSy7eH5o3xyaeh/J77yOkHM3b9/AAC5wd3NmVvSbeuEh//hWCvQg9HkZ6CvgAn
LQNW/pavKp5KNf1wOtKOTZOMEAAoghd9/OUVc/+EcQiVelK1wvDR1yMIApuvO1tJ
F1c7SxxSHUyftu4FXg2nuvKj+g==
-----END PRIVATE KEY-----
EOT

firebase_auth_domain        = "lexis-ia.firebaseapp.com"
firebase_project_id         = "lexis-ia"
firebase_storage_bucket     = "lexis-ia.firebasestorage.app"
firebase_messaging_sender_id = "78825247320"
firebase_app_id             = "1:78825247320:web:2a69ba8ceabad513f3f02d"
firebase_client_email       = "firebase-adminsdk-fbsvc@lexis-ia.iam.gserviceaccount.com"

openrouter_api_key          = "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"

# API Config
api_version   = "v1"
api_llm_model = "gpt-3.5-turbo"

# Vite Config
vite_log_level     = "prod"
#vite_api_base_url  = ""
