terraform {
  required_version = ">= 1.5.0"

  backend "gcs" {
    bucket = "tanktrack-tfstate-project-da8a174e-5a7c-48ba-8ca"
    prefix = "terraform/state"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

variable "project_id" {
  type        = string
  default     = "project-da8a174e-5a7c-48ba-8ca"
  description = "GCP Project ID"
}

variable "region" {
  type    = string
  default = "us-east1"
}

variable "github_repo" {
  type        = string
  default     = "SydneySchalk/TankTrack"
  description = "GitHub repository in OWNER/REPO format /TankTrack)"
}

provider "google" {
  project = var.project_id
  region  = var.region
}