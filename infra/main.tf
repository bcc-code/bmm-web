provider "azurerm" {
  features {}
}

locals {
  props = jsondecode(var.props)
  component_name = "" # Fill in with the component name e.g. api or cms
}

data "azurerm_resource_group" "main" {
  name = local.props.azure.resource_group
}

