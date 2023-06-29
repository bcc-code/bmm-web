provider "azurerm" {
  features {}
}

locals {
  props = jsondecode(var.props)
}

data "azurerm_resource_group" "main" {
  name = local.props.azure.resource_group
}

