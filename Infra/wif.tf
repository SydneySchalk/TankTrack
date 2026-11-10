resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudscheduler.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com"
  ])
  project            = var.project_id
  service            = each.key
  disable_on_destroy = false
}

resource "google_iam_workload_identity_pool" "github_pool" {
  workload_identity_pool_id = "github-actions-pool"
  display_name              = "GitHub Actions Pool"
  description               = "OIDC Identity Pool for TanTrack CI/CD"
}

resource "google_iam_workload_identity_pool_provider" "github_provider" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-oidc-provider"
  display_name                       = "GitHub OIDC Provider"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.actor"      = "assertion.actor"
    "attribute.repository" = "assertion.repository"
    "attribute.ref"        = "assertion.ref"
  }

  #Only accept tokens from this repository
  attribute_condition = "assertion.repository == '${var.github_repo}'"
  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account" "terraform_admin" {
  account_id   = "sa-terraform-admin"
  display_name = "Terraform Provisioning Service Account"
}

resource "google_project_iam_member" "terraform_admin_roles" {
  for_each = toset([
    "roles/run.admin",
    "roles/artifactregistry.admin",
    "roles/secretmanager.admin",
    "roles/cloudscheduler.admin",
    "roles/monitoring.admin",
    "roles/logging.configWriter",
    "roles/iam.serviceAccountAdmin",
    "roles/iam.workloadIdentityPoolAdmin",
    "roles/resourcemanager.projectIamAdmin",
    "roles/serviceusage.serviceUsageAdmin",
    "roles/storage.objectAdmin"
  ])
  project = var.project_id
  role    = each.key
  member  = "serviceAccount:${google_service_account.terraform_admin.email}"
}

#Allow GitHub repo to impersonate Terraform Admin Service Account
resource "google_service_account_iam_member" "wif_terraform_binding" {
  service_account_id = google_service_account.terraform_admin.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/${var.github_repo}"
}

#Service Account for Backend Deployer GH Action
resource "google_service_account" "gh_deploy" {
  account_id   = "sa-gh-deploy"
  display_name = "GitHub Actions Backend Deployer"
}

resource "google_project_iam_member" "gh_deploy_roles" {
  for_each = toset([
    "roles/artifactregistry.writer",
    "roles/run.developer"
  ])
  project = var.project_id
  role    = each.key
  member  = "serviceAccount:${google_service_account.gh_deploy.email}"
}

#Allow GitHub repo to impersonate Backend Deployer Service Account
resource "google_service_account_iam_member" "wif_deploy_binding" {
  service_account_id = google_service_account.gh_deploy.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github_pool.name}/attribute.repository/${var.github_repo}"
}


#outputs for later use (githubactions)
output "wif_provider_name" {
  value       = google_iam_workload_identity_pool_provider.github_provider.name
  description = "Workload Identity Provider for GitHub Actions"
}

output "terraform_sa_email" {
  value       = google_service_account.terraform_admin.email
  description = "Service Account email for /Infra workflow"
}

output "deploy_sa_email" {
  value       = google_service_account.gh_deploy.email
  description = "Service Account email for /Backend workflow"
}