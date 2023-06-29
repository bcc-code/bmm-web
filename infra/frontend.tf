resource "azurerm_static_site" "main" {
  name                = "swa-${local.props.project_name}-frontend-${local.props.app_environment}"
  location            = data.azurerm_resource_group.main.location
  resource_group_name = data.azurerm_resource_group.main.name
  sku_tier            = local.props.app_environment == "prod" ? "Standard" : "Free"
  sku_size            = local.props.app_environment == "prod" ? "Standard" : "Free"
}

# resource "azurerm_static_site_custom_domain" "main" {
#   static_site_id  = azurerm_static_site.main.id
#   domain_name     = local.props.app_environment == "prod" ? "bmm-web.brunstad.org" : "bmm-web-int.brunstad.org"
#   validation_type = "cname-delegation"

#   lifecycle {
#     ignore_changes = [
#       validation_type
#     ]
#   }

#   timeouts {
#     create = "15m"
#     update = "15m"
#     delete = "30m"
#     read   = "5m"
#   }
# }
